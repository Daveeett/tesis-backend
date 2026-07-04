import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.util";
import { publicController } from "../controllers/public.controller";

export const publicRoutes = Router();

publicRoutes.get(
  "/statements/:token",
  asyncHandler(publicController.getStatement),
);
