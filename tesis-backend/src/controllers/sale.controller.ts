import { Request, Response } from "express";
import { ok } from "../utils/response.util";
import { saleSchema } from "../entities/constants/sale.constants";
import { SalesService } from "../services/sales.service";

class SaleController {
  private readonly salesService = new SalesService();

  createSale = async (req: Request, res: Response): Promise<void> => {
    const input = saleSchema.parse(req.body);
    const result = await this.salesService.createSale({ ...input, userId: req.auth!.userId });
    res.status(201).json(ok("Venta registrada", result));
  };
}

export const saleController = new SaleController();
