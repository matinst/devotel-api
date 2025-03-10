import { ClassSerializerInterceptor, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";
import { getSwaggerDocument } from "./configs/swagger.config";
import { HttpExceptionFilter } from "./core/exceptions/http.exceptions";
import { PaginationInterceptor } from "./core/interceptors/pagination.interceptor";
import { ResponseInterceptor } from "./core/interceptors/response.interceptor";
import { JobSchedulerService } from "./modules/jobs/providers/jobsScheduler.service";
async function bootstrap() {
  const logger = new Logger("APP");
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor(), new PaginationInterceptor(), new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 204,
  });
  const configService = app.get<ConfigService>(ConfigService);

  getSwaggerDocument(app);

  const jobSchedulerService = app.get(JobSchedulerService);

  // Manually trigger the job
  jobSchedulerService.triggerJobManually();

  const PORT = configService.getOrThrow<number>("PORT");
  await app.listen(PORT, "0.0.0.0", () => {
    logger.log(`Server running at http://localhost:${PORT}`);
    logger.log(`Swagger is serving at http://localhost:${PORT}/api-docs`);
  });
}
bootstrap();
