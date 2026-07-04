import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.util";
import { notificationController } from "../controllers/notification.controller";

export const notificationRoutes = Router();

notificationRoutes.post(
  "/whatsapp/:creditId",
  asyncHandler(notificationController.createWhatsappReminder),
);

notificationRoutes.post(
  "/whatsapp/customer/:customerId",
  asyncHandler(notificationController.createWhatsappReminderByCustomer),
);
