import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";
import { ok } from "../utils/response.util";

class DashboardController {
  private readonly dashboardService = new DashboardService();

  getOverdueAlerts = async (_req: Request, res: Response): Promise<void> => {
    const alerts = await this.dashboardService.getOverdueAlerts();
    res.status(200).json(ok("Alertas obtenidas", alerts));
  };

  getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
    const stats = await this.dashboardService.getDashboardStats();
    res.status(200).json(ok("Stats obtenidos", stats));
  };
}

export const dashboardController = new DashboardController();
