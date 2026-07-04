import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { NotificationLog } from "../entities/notification-log.entity";

export class NotificationLogRepository {
  private readonly repo: Repository<NotificationLog>;

  constructor(manager?: EntityManager) {
    this.repo = (manager ?? AppDataSource).getRepository(NotificationLog);
  }

  create(data: Partial<NotificationLog>) {
    return this.repo.create(data);
  }

  save(log: NotificationLog) {
    return this.repo.save(log);
  }
}
