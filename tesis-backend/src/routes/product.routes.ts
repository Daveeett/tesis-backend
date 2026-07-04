import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.util";
import { productController } from "../controllers/product.controller";

export const productRoutes = Router();

productRoutes.post(
  "/",
  asyncHandler(productController.create),
);

productRoutes.get(
  "/",
  asyncHandler(productController.findAll),
);
