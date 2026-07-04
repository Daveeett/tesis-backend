import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { ok } from "../utils/response.util";

class NotificationController {
  private readonly notificationService = new NotificationService();

  createWhatsappReminder = async (req: Request, res: Response): Promise<void> => {
    const result = await this.notificationService.createWhatsappReminder(req.params["creditId"]!);
    res.status(200).json(ok("Recordatorio generado", result));
  };

  createWhatsappReminderByCustomer = async (req: Request, res: Response): Promise<void> => {
    const result = await this.notificationService.createWhatsappReminderByCustomer(req.params["customerId"]!);
    res.status(200).json(ok("Recordatorio general generado", result));
  };
}

export const notificationController = new NotificationController();
