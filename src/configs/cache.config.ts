import KeyvRedis from "@keyv/redis";
import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";

export function cacheConfig(): CacheModuleAsyncOptions {
  return {
    inject: [ConfigService],
    isGlobal: true,
    useFactory: async (configService: ConfigService) => {
      return {
        ttl: configService.getOrThrow<string>("CACHE_TTL"),
        stores: [new KeyvRedis(configService.getOrThrow<string>("REDIS_URI"))],
      };
    },
  };
}
