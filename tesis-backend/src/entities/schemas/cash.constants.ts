import { z } from 'zod'
import { CashMovementType } from '../enums/cash-movement-type.enum'

export const openSchema = z.object({ openingBalance: z.coerce.number().min(0) });
export const movementSchema = z.object({
  movementType: z.nativeEnum(CashMovementType),
  amount: z.coerce.number().positive(),
  concept: z.string().min(2),
});
export const closeSchema = z.object({ closingBalance: z.coerce.number().min(0) });