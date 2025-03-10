import { join } from "path";

import { config } from "dotenv";
import { DataSource } from "typeorm";

config();

const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER, NODE_ENV } = process.env;
const IS_PROD = NODE_ENV === "production";
const PATH = IS_PROD ? "dist" : "src";

export const connectionSource = new DataSource({
  type: "postgres",
  host: DB_HOST as string,
  port: parseInt(DB_PORT as string),
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  logging: true,
  entities: [join(process.cwd(), PATH, "modules/**/*.entity{.ts,.js}")],
  migrations: [join(process.cwd(), "database/migrations/*{.ts,.js}")],
  synchronize: false,
  migrationsTableName: "typeorm_migrations",
  migrationsRun: false,
});
console.log(join(process.cwd(), PATH, "modules/**/*.entity{.ts,.js}"));
