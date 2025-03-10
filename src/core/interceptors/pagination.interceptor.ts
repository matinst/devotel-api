import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { Observable, map } from "rxjs";

import { IPageFormat } from "../../common/interfaces/IPagination";

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PaginationInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const query = request.query as any;

    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.limit as string, 10) || 10;

    const className = context.getClass().name;
    const handlerName = context.getHandler().name;

    return next.handle().pipe(
      map((data) => {
        if (data && (data.paginate || data.count)) {
          const { count, paginate, ...response } = data;
          this.logger.log(`paginate response from ${className}.${handlerName}`);
          const pager = this.formatPage(page, limit, count, request);

          return {
            pager,
            ...response,
          };
        }

        return data;
      }),
    );
  }

  private formatPage(page: number, limit: number, totalItems: number, request: FastifyRequest): IPageFormat {
    const totalPages = Math.ceil(totalItems / limit);
    const prevPage = page === 1 ? false : page - 1;
    const nextPage = page >= totalPages ? false : page + 1;

    const formatLink = (pageNum: number | boolean): string | boolean => {
      if (!pageNum) return false;
      const protocol = request.protocol;
      const hostname = request.hostname;
      const originalUrl = request.url;
      return `${protocol}://${hostname}${originalUrl.split("?")[0]}?page=${pageNum}&limit=${limit}`;
    };

    return {
      page,
      limit,
      totalItems,
      totalPages,
      prevPage: formatLink(prevPage),
      nextPage: formatLink(nextPage),
    };
  }
}
