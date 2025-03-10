import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";

@Injectable()
export class HTTPLogger implements NestMiddleware {
  private readonly logger = new Logger(HTTPLogger.name);
  //   use(req: any, res: any, next: (error?: Error | any) => void) {}

  use(req: FastifyRequest, rep: FastifyReply["raw"], next: () => void) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.headers["user-agent"] || "";
    const startAt = process.hrtime();

    rep.on("finish", () => {
      const { statusCode } = rep;
      const contentLength = rep.getHeader("content-length") || 0;
      const dif = process.hrtime(startAt);
      const responseTime = dif[0] * 1e3 + dif[1] * 1e-6;
      this.logger.log(
        `${method} - ${originalUrl} - ${statusCode} - ${contentLength} - ${userAgent} - ${ip} - ${responseTime.toFixed(2)}ms`,
      );
    });

    next();
  }
}
