import { SharedBullAsyncConfiguration } from "@nestjs/bullmq";
import { ConfigService } from "@nestjs/config";

export function bullMqConfig(): SharedBullAsyncConfiguration {
  return {
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      connection: {
        url: configService.getOrThrow<string>("REDIS_URI"),
      },
      defaultJobOptions: {
        removeOnComplete: 1000,
        removeOnFail: 5000,
        attempts: 3,
      },
    }),
  };
}
