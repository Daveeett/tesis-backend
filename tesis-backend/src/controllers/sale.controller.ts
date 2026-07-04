import { Request, Response } from "express";
import { z } from "zod";
import { PaymentType } from "../entities/enums/payment-type.enum";
import { SalesService } from "../services/sales.service";
import { ok } from "../utils/response.util";

const saleSchema = z.object({
  paymentType: z.nativeEnum(PaymentType),
  customerId: z.string().uuid().optional(),
  dueDate: z.string().optional(),
  upfrontPaid: z.coerce.number().min(0).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        qty: z.coerce.number().int().positive(),
      }),
    )
    .min(1),
});

class SaleController {
  private readonly salesService = new SalesService();

  createSale = async (req: Request, res: Response): Promise<void> => {
    const input = saleSchema.parse(req.body);
    const result = await this.salesService.createSale({ ...input, userId: req.auth!.userId });
    res.status(201).json(ok("Venta registrada", result));
  };
}

export const saleController = new SaleController();
