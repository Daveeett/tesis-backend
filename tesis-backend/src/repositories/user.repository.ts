import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";

export class UserRepository {
  private readonly repo: Repository<User>;

  constructor(manager?: EntityManager) {
    this.repo = (manager ?? AppDataSource).getRepository(User);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findActiveSessionUser(id: string) {
    return this.repo.findOne({
      where: { id, isActive: true },
      select: ["id", "sessionToken", "role"],
    });
  }

  create(data: Partial<User>) {
    return this.repo.create(data);
  }

  save(user: User) {
    return this.repo.save(user);
  }

  update(id: string, data: Partial<User>) {
    return this.repo.update(id, data);
  }
}
