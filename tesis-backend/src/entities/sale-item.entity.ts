import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Sale } from "./sale.entity";
import { Product } from "./product.entity";

@Entity("sale_items")
export class SaleItem extends BaseEntity {
  @ManyToOne(() => Sale, (sale) => sale.items, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "sale_id" })
  sale!: Sale;

  @ManyToOne(() => Product, (product) => product.saleItems, { nullable: false })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column({ type: "int" })
  qty!: number;

  @Column({ name: "unit_price", type: "decimal", precision: 12, scale: 2 })
  unitPrice!: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  subtotal!: string;
}
