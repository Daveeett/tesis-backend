import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { SaleItem } from "../entities/sale-item.entity";

export class SaleItemRepository {
  private readonly repo: Repository<SaleItem>;

  constructor(manager?: EntityManager) {
    this.repo = (manager ?? AppDataSource).getRepository(SaleItem);
  }

  create(data: Partial<SaleItem>) {
    return this.repo.create(data);
  }

  saveMany(items: SaleItem[]) {
    return this.repo.save(items);
  }
}
