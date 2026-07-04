import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { SaleItem } from "./sale-item.entity";
import { CreditItem } from "./credit-item.entity";

@Entity("products")
export class Product extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 50 })
  sku!: string;

  @Column({ length: 180 })
  name!: string;

  @Column({ name: "unit_price", type: "decimal", precision: 12, scale: 2 })
  unitPrice!: string;

  @Column({ type: "int", default: 0 })
  stock!: number;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;

  @OneToMany(() => SaleItem, (saleItem) => saleItem.product)
  saleItems!: SaleItem[];

  @OneToMany(() => CreditItem, (creditItem) => creditItem.product)
  creditItems!: CreditItem[];
}
