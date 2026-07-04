import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { PaymentType } from "./enums/payment-type.enum";
import { User } from "./user.entity";
import { Customer } from "./customer.entity";
import { SaleItem } from "./sale-item.entity";
import { Credit } from "./credit.entity";

@Entity("sales")
export class Sale extends BaseEntity {
  @Index()
  @Column({ name: "sale_date", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  saleDate!: Date;

  @Column({ name: "total_amount", type: "decimal", precision: 12, scale: 2 })
  totalAmount!: string;

  @Column({
    name: "payment_type",
    type: "enum",
    enum: PaymentType,
    default: PaymentType.CASH,
  })
  paymentType!: PaymentType;

  @ManyToOne(() => User, (user) => user.sales, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Customer, (customer) => customer.sales, { nullable: true })
  @JoinColumn({ name: "customer_id" })
  customer!: Customer | null;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
  items!: SaleItem[];

  @OneToOne(() => Credit, (credit) => credit.sale)
  credit!: Credit;
}
