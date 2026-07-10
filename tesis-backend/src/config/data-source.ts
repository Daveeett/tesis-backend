import "reflect-metadata";
import { DataSource } from "typeorm";
import { entities } from "../entities";
import { config } from "./environment";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.pass,
  database: config.database.name,
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
  synchronize: config.server.nodeEnv === "development",
  logging: true,
  entities,
  migrations: ["src/migrations/*.ts", "dist/migrations/*.js"],
});
