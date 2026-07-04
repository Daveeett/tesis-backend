import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { CashSessionStatus } from "./enums/cash-session-status.enum";
import { User } from "./user.entity";
import { CashMovement } from "./cash-movement.entity";

@Entity("cash_sessions")
export class CashSession extends BaseEntity {
  @Column({ name: "opened_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  openedAt!: Date;

  @Column({ name: "closed_at", type: "timestamp", nullable: true })
  closedAt!: Date | null;

  @Column({ name: "opening_balance", type: "decimal", precision: 12, scale: 2 })
  openingBalance!: string;

  @Column({ name: "closing_balance", type: "decimal", precision: 12, scale: 2, nullable: true })
  closingBalance!: string | null;

  @Column({ name: "expected_balance", type: "decimal", precision: 12, scale: 2, nullable: true })
  expectedBalance!: string | null;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  difference!: string | null;

  @Column({
    type: "enum",
    enum: CashSessionStatus,
    default: CashSessionStatus.OPEN,
  })
  status!: CashSessionStatus;

  @ManyToOne(() => User, (user) => user.openedSessions, { nullable: false })
  @JoinColumn({ name: "opened_by" })
  openedBy!: User;

  @ManyToOne(() => User, (user) => user.closedSessions, { nullable: true })
  @JoinColumn({ name: "closed_by" })
  closedBy!: User | null;

  @OneToMany(() => CashMovement, (movement) => movement.cashSession)
  movements!: CashMovement[];
}
