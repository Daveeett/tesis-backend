import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { CashSession } from "../entities/cash-session.entity";
import { CashSessionStatus } from "../entities/enums/cash-session-status.enum";

export class CashSessionRepository {
  private readonly repo: Repository<CashSession>;

  constructor(manager?: EntityManager) {
    this.repo = (manager ?? AppDataSource).getRepository(CashSession);
  }

  findOpenSession(withMovements = false) {
    const relations = withMovements ? { movements: true } : undefined;
    return this.repo.findOne({
      where: { status: CashSessionStatus.OPEN },
      relations,
      order: { openedAt: "DESC" },
    });
  }

  findHistory() {
    return this.repo.find({
      relations: { openedBy: true, closedBy: true, movements: true },
      order: { openedAt: "DESC" },
      take: 20,
    });
  }

  create(data: Partial<CashSession>) {
    return this.repo.create(data);
  }

  save(session: CashSession) {
    return this.repo.save(session);
  }
}
