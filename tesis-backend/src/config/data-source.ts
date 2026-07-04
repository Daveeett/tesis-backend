import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./environment";
import { entities } from "../entities";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
  synchronize: env.NODE_ENV === "development",
  logging: false, // Apagado para ver los correos sin spam de SQL
  entities,
  migrations: ["src/migrations/*.ts", "dist/migrations/*.js"],
});
