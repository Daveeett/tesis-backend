import { Request, Response } from "express";
import { z } from "zod";
import { CustomerService } from "../services/customer.service";
import { ok } from "../utils/response.util";

const createSchema = z.object({
  docType: z.string().min(1),
  docNumber: z.string().min(1),
  fullName: z.string().min(2),
  phone: z.string().min(7),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  address: z.string().optional(),
});

class CustomerController {
  private readonly customerService = new CustomerService();

  create = async (req: Request, res: Response): Promise<void> => {
    const input = createSchema.parse(req.body);
    const customer = await this.customerService.create(input);
    res.status(201).json(ok("Cliente registrado", customer));
  };

  findAll = async (_req: Request, res: Response): Promise<void> => {
    const customers = await this.customerService.findAll();
    res.status(200).json(ok("Clientes obtenidos", customers));
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    const customer = await this.customerService.findById(req.params["id"]!);
    res.status(200).json(ok("Cliente obtenido", customer));
  };
}

export const customerController = new CustomerController();
