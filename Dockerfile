# Stage 1: Build Stage
FROM node:22-alpine AS base

RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare pnpm@9 --activate

# Install tzdata to support timezone settings
RUN apk add --no-cache tzdata

# Set the timezone to Asia/Tehran
RUN cp /usr/share/zoneinfo/Asia/Tehran /etc/localtime && echo "Asia/Tehran" > /etc/timezone


FROM base AS deps
WORKDIR /temp-deps
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --loglevel info


FROM base AS builder
WORKDIR /build
COPY . ./
COPY --from=deps /temp-deps/node_modules ./node_modules
RUN if [ -f package.json ] && grep -q '"build":' package.json; then pnpm run build; fi
RUN pnpm install --prod --frozen-lockfile --loglevel info

FROM base AS runner
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

COPY . ./
COPY --from=builder --chown=appuser:appgroup /build/ ./

RUN chown -R appuser:appgroup /app

USER appuser

ENV NODE_ENV=production
EXPOSE 3500

CMD ["npm", "start"]
