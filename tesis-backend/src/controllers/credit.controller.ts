import { Request, Response } from "express";
import { CreditService } from "../services/credit.service";
import { ok } from "../utils/response.util";
import { createCreditSchema, paymentSchema } from "../entities/schemas/credit.constants";

class CreditController {
  private readonly creditService = new CreditService();

  findCustomerCredits = async (req: Request, res: Response): Promise<void> => {
    const credits = await this.creditService.findCustomerCredits(req.params["customerId"]!);
    res.status(200).json(ok("Creditos obtenidos", credits));
  };

  getSemaphoreByCustomer = async (req: Request, res: Response): Promise<void> => {
    const semaphore = await this.creditService.getSemaphoreByCustomer(req.params["customerId"]!);
    res.status(200).json(ok("Semaforo obtenido", semaphore));
  };

  createCredit = async (req: Request, res: Response): Promise<void> => {
    const input = createCreditSchema.parse(req.body);
    const result = await this.creditService.createCredit({ ...input, userId: req.auth!.userId });
    res.status(201).json(ok("Credito creado", result));
  };

  registerPayment = async (req: Request, res: Response): Promise<void> => {
    const input = paymentSchema.parse(req.body);
    const result = await this.creditService.registerPayment({ ...input, userId: req.auth!.userId });
    res.status(200).json(ok("Pago registrado", result));
  };
}

export const creditController = new CreditController();
