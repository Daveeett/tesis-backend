import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { CreditAccount } from "./credit-account.entity";

@Entity("account_statements")
export class AccountStatement extends BaseEntity {
  @ManyToOne(() => CreditAccount, (account) => account.statements, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "credit_account_id" })
  creditAccount!: CreditAccount;

  @Index({ unique: true })
  @Column({ name: "public_token", length: 120 })
  publicToken!: string;

  @Column({ name: "generated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  generatedAt!: Date;

  @Column({ name: "expires_at", type: "timestamp", nullable: true })
  expiresAt!: Date | null;

  @Column({ default: true })
  active!: boolean;
}
