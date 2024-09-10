import {z} from 'zod';

export const purchaseHistorySchema = z.object({
  _id: z.string(),
  codeProduct: z.string(),
  createdAt: z.string(),
  nameSupplier: z.string(),
  purchaseDesc: z.string(),
  purchasePrice: z.number(),
  unitQuantity: z.number(),
});

export const purchasesHistorySchema = z.array(purchaseHistorySchema)
export type PurchaseHistory = z.infer<typeof purchaseHistorySchema>
export type PurchaseHistoryCreateForm = Pick<PurchaseHistory, 'nameSupplier' | 'codeProduct' | 'unitQuantity' | 'purchasePrice' | 'purchaseDesc'>