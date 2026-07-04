import { Column, Entity, Index, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserRole } from "./enums/user-role.enum";
import { Sale } from "./sale.entity";
import { CashMovement } from "./cash-movement.entity";
import { CashSession } from "./cash-session.entity";
import { Payment } from "./payment.entity";

@Entity("users")
export class User extends BaseEntity {
  @Column({ length: 150 })
  name!: string;

  @Index({ unique: true })
  @Column({ length: 180 })
  email!: string;

  @Column({ name: "password_hash", length: 255 })
  passwordHash!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CAJERO,
  })
  role!: UserRole;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;

  /** UUID rotado en cada login — si cambia, la sesion anterior queda invalida */
  @Column({ name: "session_token", type: "uuid", nullable: true, default: null })
  sessionToken!: string | null;

  /** Contador de intentos fallidos consecutivos */
  @Column({ name: "failed_attempts", type: "int", default: 0 })
  failedAttempts!: number;

  /** Hasta cuándo la cuenta está bloqueada */
  @Column({ name: "locked_until", type: "timestamp", nullable: true, default: null })
  lockedUntil!: Date | null;

  @OneToMany(() => Sale, (sale) => sale.user)
  sales!: Sale[];

  @OneToMany(() => CashMovement, (movement) => movement.user)
  movements!: CashMovement[];

  @OneToMany(() => CashSession, (session) => session.openedBy)
  openedSessions!: CashSession[];

  @OneToMany(() => CashSession, (session) => session.closedBy)
  closedSessions!: CashSession[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];
}
