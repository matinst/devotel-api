import { HttpModule } from "@nestjs/axios";
import { BullModule } from "@nestjs/bullmq";
import { CacheModule } from "@nestjs/cache-manager";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";

import { bullMqConfig } from "./configs/bullmq.config";
import { cacheConfig } from "./configs/cache.config";
import { rateLimitConfig } from "./configs/rateLimit.config";
import { databaseConfigs } from "./configs/typeorm.config";
import { HTTPLogger } from "./core/middlewares/logger.middleware";
import { JobsModule } from "./modules/jobs/jobs.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.forRootAsync(bullMqConfig()),
    ThrottlerModule.forRootAsync(rateLimitConfig()),
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    CacheModule.registerAsync(cacheConfig()),
    TypeOrmModule.forRootAsync(databaseConfigs()),
    HttpModule.register({ global: true, timeout: 10000, headers: { "Content-Type": "application/json" } }),
    JobsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HTTPLogger).forRoutes("*");
  }
}
