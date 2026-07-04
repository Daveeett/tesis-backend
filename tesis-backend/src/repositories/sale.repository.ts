import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Sale } from "../entities/sale.entity";

export class SaleRepository {
  private readonly repo: Repository<Sale>;

  constructor(manager?: EntityManager) {
    this.repo = (manager ?? AppDataSource).getRepository(Sale);
  }

  create(data: Partial<Sale>) {
    return this.repo.create(data);
  }

  save(sale: Sale) {
    return this.repo.save(sale);
  }
}
