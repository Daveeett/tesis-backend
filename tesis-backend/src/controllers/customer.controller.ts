import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service";
import { ok } from "../utils/response.util";
import { createSchema } from "../entities/schemas/customer.constants";


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
