import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Payment } from "../entities/payment.entity";

export class PaymentRepository {
  private readonly repo: Repository<Payment>;

  constructor(manager?: EntityManager) {
    this.repo = (manager ?? AppDataSource).getRepository(Payment);
  }

  async sumByCreditId(creditId: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder("payment")
      .select("COALESCE(SUM(payment.amount), 0)", "sum")
      .where("payment.credit_id = :creditId", { creditId })
      .getRawOne();

    return Number(result?.sum ?? 0);
  }

  create(data: Partial<Payment>) {
    return this.repo.create(data);
  }

  save(payment: Payment) {
    return this.repo.save(payment);
  }
}
