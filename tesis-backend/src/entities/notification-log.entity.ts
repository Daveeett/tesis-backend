import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Customer } from "./customer.entity";
import { Credit } from "./credit.entity";
import { NotificationChannel } from "./enums/notification-channel.enum";
import { NotificationStatus } from "./enums/notification-status.enum";

@Entity("notifications_log")
export class NotificationLog extends BaseEntity {
  @ManyToOne(() => Customer, (customer) => customer.notifications, { nullable: false })
  @JoinColumn({ name: "customer_id" })
  customer!: Customer;

  @ManyToOne(() => Credit, (credit) => credit.notifications, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "credit_id" })
  credit!: Credit | null;

  @Column({
    type: "enum",
    enum: NotificationChannel,
    default: NotificationChannel.EMAIL,
  })
  channel!: NotificationChannel;

  @Column({ type: "text" })
  message!: string;

  @Column({ name: "wa_link", type: "text", nullable: true })
  waLink!: string;

  @Column({ name: "sent_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  sentAt!: Date;

  @Column({
    type: "enum",
    enum: NotificationStatus,
    default: NotificationStatus.SENT,
  })
  status!: NotificationStatus;
}
