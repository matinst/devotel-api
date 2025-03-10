import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  //
  intercept(context: ExecutionContext, next: CallHandler<Record<string, unknown>>): Observable<unknown> {
    const ctx = context.switchToHttp().getResponse<FastifyReply>();
    const statusCode = ctx.statusCode;

    return next.handle().pipe(
      map((data) => {
        if (data && data.data !== undefined) {
          return {
            statusCode,
            success: true,
            data: data.data,
          };
        }
        return {
          statusCode,
          success: true,
          data,
        };
      }),
    );
  }
}
