import { Request, Response } from "express";
import { StatementService } from "../services/statement.service";
import { ok } from "../utils/response.util";

class StatementController {
  private readonly statementService = new StatementService();

  generateToken = async (req: Request, res: Response): Promise<void> => {
    const result = await this.statementService.generateTokenByCustomer(req.params["customerId"]!);
    res.status(201).json(ok("Token generado", result));
  };
}

export const statementController = new StatementController();
