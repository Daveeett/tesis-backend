import { EntityManager, In, Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/product.entity";

export class ProductRepository {
  private readonly repo: Repository<Product>;

  constructor(manager?: EntityManager) {
    this.repo = (manager ?? AppDataSource).getRepository(Product);
  }

  findBySku(sku: string) {
    return this.repo.findOne({ where: { sku } });
  }

  findByIds(ids: string[]) {
    return this.repo.find({ where: { id: In(ids) } });
  }

  findActiveAll() {
    return this.repo.find({
      where: { isActive: true },
      order: { createdAt: "DESC" },
    });
  }

  create(data: Partial<Product>) {
    return this.repo.create(data);
  }

  save(product: Product) {
    return this.repo.save(product);
  }

  saveMany(products: Product[]) {
    return this.repo.save(products);
  }
}
