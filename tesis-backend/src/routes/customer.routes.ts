import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.util";
import { customerController } from "../controllers/customer.controller";

export const customerRoutes = Router();

customerRoutes.post(
  "/",
  asyncHandler(customerController.create),
);

customerRoutes.get(
  "/",
  asyncHandler(customerController.findAll),
);

customerRoutes.get(
  "/:id",
  asyncHandler(customerController.findById),
);
