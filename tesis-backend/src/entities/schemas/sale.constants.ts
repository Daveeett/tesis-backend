import z from 'zod';
import { PaymentType } from '../enums/payment-type.enum';

export const saleSchema = z.object({
  paymentType: z.nativeEnum(PaymentType),
  customerId: z.string().uuid().optional(),
  dueDate: z.string().optional(),
  upfrontPaid: z.coerce.number().min(0).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        qty: z.coerce.number().int().positive(),
      }),
    )
    .min(1),
});