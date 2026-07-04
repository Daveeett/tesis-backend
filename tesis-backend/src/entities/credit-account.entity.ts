import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Customer } from "./customer.entity";
import { CreditAccountStatus } from "./enums/credit-account-status.enum";
import { Credit } from "./credit.entity";
import { AccountStatement } from "./account-statement.entity";

@Entity("credit_accounts")
export class CreditAccount extends BaseEntity {
  @OneToOne(() => Customer, (customer) => customer.creditAccount, { nullable: false })
  @JoinColumn({ name: "customer_id" })
  customer!: Customer;

  @Column({
    type: "enum",
    enum: CreditAccountStatus,
    default: CreditAccountStatus.OPEN,
  })
  status!: CreditAccountStatus;

  @Column({ name: "total_debt", type: "decimal", precision: 12, scale: 2, default: 0 })
  totalDebt!: string;

  @Column({ name: "total_paid", type: "decimal", precision: 12, scale: 2, default: 0 })
  totalPaid!: string;

  @Column({ name: "current_balance", type: "decimal", precision: 12, scale: 2, default: 0 })
  currentBalance!: string;

  @Column({ name: "last_activity_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  lastActivityAt!: Date;

  @OneToMany(() => Credit, (credit) => credit.creditAccount)
  credits!: Credit[];

  @OneToMany(() => AccountStatement, (statement) => statement.creditAccount)
  statements!: AccountStatement[];
}
