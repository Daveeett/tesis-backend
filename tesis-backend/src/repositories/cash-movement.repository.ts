import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { CashMovement } from "../entities/cash-movement.entity";

export class CashMovementRepository {
  private readonly repo: Repository<CashMovement>;

  constructor(manager?: EntityManager) {
    this.repo = (manager ?? AppDataSource).getRepository(CashMovement);
  }

  async sumBySession(sessionId: string): Promise<{ income: number; expense: number }> {
    const totals = await this.repo
      .createQueryBuilder("movement")
      .select(
        "COALESCE(SUM(CASE WHEN movement.movement_type = 'INCOME' THEN movement.amount ELSE 0 END), 0)",
        "income",
      )
      .addSelect(
        "COALESCE(SUM(CASE WHEN movement.movement_type = 'EXPENSE' THEN movement.amount ELSE 0 END), 0)",
        "expense",
      )
      .where("movement.cash_session_id = :sessionId", { sessionId })
      .getRawOne();

    return { income: Number(totals?.income ?? 0), expense: Number(totals?.expense ?? 0) };
  }

  findByDateRange(startIso: string, endIso: string) {
    return this.repo
      .createQueryBuilder("m")
      .where("m.created_at >= :start AND m.created_at <= :end", {
        start: startIso,
        end: endIso,
      })
      .getMany();
  }

  create(data: Partial<CashMovement>) {
    return this.repo.create(data);
  }

  save(movement: CashMovement) {
    return this.repo.save(movement);
  }
}
