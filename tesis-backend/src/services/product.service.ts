import { AppError } from "../utils/app-error.util";
import { ProductRepository } from "../repositories/product.repository";

export class ProductService {
  private readonly productRepo = new ProductRepository();

  async create(input: { sku: string; name: string; unitPrice: number; stock: number }) {
    const exists = await this.productRepo.findBySku(input.sku);
    if (exists) throw new AppError("SKU ya existe", 409, "PRODUCT_SKU_EXISTS");

    const product = this.productRepo.create({
      sku: input.sku,
      name: input.name,
      unitPrice: input.unitPrice.toFixed(2),
      stock: input.stock,
      isActive: true,
    });
    return this.productRepo.save(product);
  }

  async findAll() {
    return this.productRepo.findActiveAll();
  }
}
