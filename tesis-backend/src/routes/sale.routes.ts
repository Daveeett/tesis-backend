import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.util";
import { saleController } from "../controllers/sale.controller";

export const saleRoutes = Router();

saleRoutes.post(
  "/",
  asyncHandler(saleController.createSale),
);
