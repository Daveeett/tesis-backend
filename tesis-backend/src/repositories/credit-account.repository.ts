import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { CreditAccount } from "../entities/credit-account.entity";

export class CreditAccountRepository {
  private readonly repo: Repository<CreditAccount>;

  constructor(manager?: EntityManager) {
    this.repo = (manager ?? AppDataSource).getRepository(CreditAccount);
  }

  findByCustomerWithCredits(customerId: string) {
    return this.repo.findOne({
      where: { customer: { id: customerId } },
      relations: { credits: true },
    });
  }

  findByCustomerWithCustomer(customerId: string) {
    return this.repo.findOne({
      where: { customer: { id: customerId } },
      relations: { customer: true },
    });
  }

  findAllWithCustomerByBalance() {
    return this.repo.find({
      relations: { customer: true },
      order: { currentBalance: "DESC" },
    });
  }

  create(data: Partial<CreditAccount>) {
    return this.repo.create(data);
  }

  save(account: CreditAccount) {
    return this.repo.save(account);
  }
}
