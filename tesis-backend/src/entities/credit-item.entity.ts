import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Credit } from "./credit.entity";
import { Product } from "./product.entity";

@Entity("credit_items")
export class CreditItem extends BaseEntity {
  @ManyToOne(() => Credit, (credit) => credit.items, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "credit_id" })
  credit!: Credit;

  @ManyToOne(() => Product, (product) => product.creditItems, { nullable: false })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column({ type: "int" })
  qty!: number;

  @Column({ name: "unit_price", type: "decimal", precision: 12, scale: 2 })
  unitPrice!: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  subtotal!: string;
}
