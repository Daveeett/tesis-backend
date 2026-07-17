import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { ok } from "../utils/response.util";
import { createSchema } from "../entities/schemas/product.constants";

class ProductController {
  private readonly productService = new ProductService();

  create = async (req: Request, res: Response): Promise<void> => {
    const input = createSchema.parse(req.body);
    const product = await this.productService.create(input);
    res.status(201).json(ok("Producto creado", product));
  };

  findAll = async (_req: Request, res: Response): Promise<void> => {
    const products = await this.productService.findAll();
    res.status(200).json(ok("Productos obtenidos", products));
  };
}

export const productController = new ProductController();
