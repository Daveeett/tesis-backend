import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { AccountStatement } from "../entities/account-statement.entity";

export class AccountStatementRepository {
  private readonly repo: Repository<AccountStatement>;

  constructor(manager?: EntityManager) {
    this.repo = (manager ?? AppDataSource).getRepository(AccountStatement);
  }

  findActiveByToken(token: string) {
    return this.repo.findOne({
      where: { publicToken: token, active: true },
      relations: {
        creditAccount: {
          customer: true,
          credits: { items: { product: true }, payments: true },
        },
      },
    });
  }

  create(data: Partial<AccountStatement>) {
    return this.repo.create(data);
  }

  save(statement: AccountStatement) {
    return this.repo.save(statement);
  }
}
