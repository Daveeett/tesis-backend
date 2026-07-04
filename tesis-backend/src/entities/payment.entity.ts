import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Credit } from "./credit.entity";
import { PaymentType } from "./enums/payment-type.enum";
import { User } from "./user.entity";

@Entity("payments")
export class Payment extends BaseEntity {
  @ManyToOne(() => Credit, (credit) => credit.payments, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "credit_id" })
  credit!: Credit;

  @Column({ name: "payment_date", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  paymentDate!: Date;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  amount!: string;

  @Column({ type: "enum", enum: PaymentType, default: PaymentType.CASH })
  method!: PaymentType;

  @Column({ length: 100, nullable: true })
  reference!: string;

  @ManyToOne(() => User, (user) => user.payments, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user!: User;
}
