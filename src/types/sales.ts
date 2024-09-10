import {z} from 'zod';

export const productSaleSchema = z.object({
  idProduct: z.string(),
  nameProduct: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  subtotal: z.number()
});

export const saleSchema = z.object({
  _id: z.string(),
  nameCustomer: z.string(),
  products: z.array(productSaleSchema),
  totalPrice: z.number(),
  createdAt: z.string(),
  description: z.string()
});

export const salesSchema = z.array(saleSchema);

export type Sale = z.infer<typeof saleSchema>
export type ProductSale = z.infer<typeof productSaleSchema>
