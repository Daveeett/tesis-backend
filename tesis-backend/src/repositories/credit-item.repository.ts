import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { CreditItem } from "../entities/credit-item.entity";

export class CreditItemRepository {
  private readonly repo: Repository<CreditItem>;

  constructor(manager?: EntityManager) {
    this.repo = (manager ?? AppDataSource).getRepository(CreditItem);
  }

  create(data: Partial<CreditItem>) {
    return this.repo.create(data);
  }

  saveMany(items: CreditItem[]) {
    return this.repo.save(items);
  }
}
