import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.util";
import { creditController } from "../controllers/credit.controller";

export const creditRoutes = Router();

creditRoutes.get(
  "/customer/:customerId",
  asyncHandler(creditController.findCustomerCredits),
);

creditRoutes.get(
  "/customer/:customerId/semaphore",
  asyncHandler(creditController.getSemaphoreByCustomer),
);

creditRoutes.post(
  "/",
  asyncHandler(creditController.createCredit),
);

creditRoutes.post(
  "/payment",
  asyncHandler(creditController.registerPayment),
);
