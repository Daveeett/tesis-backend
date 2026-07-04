import { EntityManager } from "typeorm";
import { AppDataSource } from "../config/data-source";

export class UnitOfWork {
  async withTransaction<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    return AppDataSource.transaction(work);
  }
}
