import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { CashMovementType } from "./enums/cash-movement-type.enum";
import { CashSession } from "./cash-session.entity";
import { User } from "./user.entity";

@Entity("cash_movements")
export class CashMovement extends BaseEntity {
  @ManyToOne(() => CashSession, (session) => session.movements, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cash_session_id" })
  cashSession!: CashSession;

  @Column({
    name: "movement_type",
    type: "enum",
    enum: CashMovementType,
  })
  movementType!: CashMovementType;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  amount!: string;

  @Column({ length: 200 })
  concept!: string;

  @ManyToOne(() => User, (user) => user.movements, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user!: User;
}
