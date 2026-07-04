import { EntityManager, In, Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Credit } from "../entities/credit.entity";
import { CreditStatus } from "../entities/enums/credit-status.enum";

export class CreditRepository {
  private readonly repo: Repository<Credit>;

  constructor(manager?: EntityManager) {
    this.repo = (manager ?? AppDataSource).getRepository(Credit);
  }

  findByIdWithAccount(creditId: string) {
    return this.repo.findOne({
      where: { id: creditId },
      relations: { creditAccount: true },
    });
  }

  findByIdWithAccountCustomer(creditId: string) {
    return this.repo.findOne({
      where: { id: creditId },
      relations: { creditAccount: { customer: true } },
    });
  }

  findCustomerCredits(customerId: string) {
    return this.repo.find({
      where: { creditAccount: { customer: { id: customerId } } },
      relations: { payments: true, items: { product: true } },
      order: { dueDate: "ASC" },
    });
  }

  findOverdueCredits(today: string) {
    return this.repo
      .createQueryBuilder("credit")
      .leftJoinAndSelect("credit.creditAccount", "account")
      .leftJoinAndSelect("account.customer", "customer")
      .where("credit.status IN (:...statuses)", {
        statuses: [CreditStatus.OPEN, CreditStatus.PARTIAL, CreditStatus.OVERDUE],
      })
      .andWhere("credit.due_date < :today", { today })
      .orderBy("credit.due_date", "ASC")
      .getMany();
  }

  findByStatuses(statuses: CreditStatus[]) {
    return this.repo.find({ where: { status: In(statuses) } });
  }

  create(data: Partial<Credit>) {
    return this.repo.create(data);
  }

  save(credit: Credit) {
    return this.repo.save(credit);
  }
}
