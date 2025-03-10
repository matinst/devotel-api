import { HttpModuleAsyncOptions } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

export function httpConfig(): HttpModuleAsyncOptions {
  return {
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      return {
        timeout: configService.getOrThrow<number>("AXIOS_TIMEOUT"),
        headers: { "Content-Type": "application/json" },
        global: true,
      };
    },
  };
}
