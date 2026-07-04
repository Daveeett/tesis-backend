import { Request, Response } from "express";
import { ReportService } from "../services/report.service";

class ReportController {
  private readonly reportService = new ReportService();

  buildReceivablesReport = async (_req: Request, res: Response): Promise<void> => {
    const buffer = await this.reportService.buildReceivablesReport();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=cartera-por-cobrar.pdf");
    res.status(200).send(buffer);
  };

  buildReceivablesExcel = async (_req: Request, res: Response): Promise<void> => {
    const buffer = await this.reportService.buildReceivablesExcel();
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=cartera-por-cobrar.xlsx");
    res.status(200).send(buffer);
  };
}

export const reportController = new ReportController();
