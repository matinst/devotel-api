import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";
import { ConfigService } from "@nestjs/config";
import { ThrottlerAsyncOptions } from "@nestjs/throttler";

import { AuthMessage } from "../common/enums/message.enum";

export function rateLimitConfig(): ThrottlerAsyncOptions {
  return {
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      throttlers: [
        {
          ttl: configService.getOrThrow("THROTTLE_TTL"),
          limit: configService.getOrThrow("THROTTLE_LIMIT"),
        },
      ],
      errorMessage: AuthMessage.TOO_MANY_REQUESTS,
      storage: new ThrottlerStorageRedisService(configService.getOrThrow("REDIS_URI")),
    }),
  };
}
