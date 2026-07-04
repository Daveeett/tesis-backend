import { Request, Response } from "express";
import { StatementService } from "../services/statement.service";
import { ok } from "../utils/response.util";

class PublicController {
  private readonly statementService = new StatementService();

  getStatement = async (req: Request, res: Response): Promise<void> => {
    const data = await this.statementService.getPublicStatement(req.params["token"]!);
    res.status(200).json(ok("Estado de cuenta obtenido", data));
  };
}

export const publicController = new PublicController();
