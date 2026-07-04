import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("postgres"),
  DB_NAME: z.string().default("mini_market_urbano"),
  DB_SSL: z.string().optional().transform((v) => v === "true"),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default("12h"),
  DUE_SOON_DAYS: z.coerce.number().default(3),
  BANK_ACCOUNT_TEXT: z.string().default(""),
  FRONTEND_BASE_URL: z.string().default("http://localhost:4200"),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

export const env = parsed.data;
