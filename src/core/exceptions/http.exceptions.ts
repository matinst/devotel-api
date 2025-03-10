import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { FastifyReply } from "fastify";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    // const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse();
    const message = this.extractMessage(exceptionResponse);

    reply.status(status).send({
      statusCode: status,
      success: false,
      error: {
        message,
        // timestamp: new Date().toISOString(),
        // path: request.url,
      },
    });
  }

  private extractMessage(response: string | Record<string, any>): string | string[] {
    if (typeof response === "string") {
      return [response];
    }
    if (typeof response === "object" && "message" in response) {
      return Array.isArray(response.message) ? response.message : [response.message];
    }

    return "something wrong";
  }
}
