import z from 'zod';

export const createSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(2),
  unitPrice: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
});
