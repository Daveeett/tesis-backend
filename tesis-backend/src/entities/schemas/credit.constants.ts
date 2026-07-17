import z from 'zod'
import { PaymentType } from '../enums/payment-type.enum'


export const createCreditSchema = z.object({
  customerId: z.string().uuid(),
  email: z.string().email(),
  amount: z.coerce.number().positive(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const paymentSchema = z.object({
  creditId: z.string().uuid(),
  amount: z.coerce.number().positive(),
  method: z.nativeEnum(PaymentType).default(PaymentType.CASH),
  reference: z.string().optional(),
});