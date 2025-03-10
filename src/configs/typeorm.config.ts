import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";

export function databaseConfigs(): TypeOrmModuleAsyncOptions {
  return {
    inject: [ConfigService],
    useFactory(configService: ConfigService) {
      return {
        type: "postgres",
        host: configService.getOrThrow<string>("DB_HOST"),
        port: configService.getOrThrow<number>("DB_PORT"),
        database: configService.getOrThrow<string>("DB_NAME"),
        username: configService.getOrThrow<string>("DB_USER"),
        password: configService.getOrThrow<string>("DB_PASS"),
        autoLoadEntities: true,
        synchronize: true,
        logging: configService.getOrThrow<string>("NODE_ENV") == "production" ? false : true,
        migrationsTableName: "typeorm_migrations",
        migrationsRun: false,
      };
    },
  };
}
