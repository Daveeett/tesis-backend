import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { config } from "./config/environment";
import { router } from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { swaggerSpec } from "./docs/swagger";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: config.server.frontendBaseUrl,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));

  app.use(
    "/api",
    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 600,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Backend operativo",
      data: {
        service: "tesis-backend",
      },
    });
  });

  app.get("/api/docs.json", (_req, res) => {
    res.status(200).json(swaggerSpec);
  });

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/api", router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
