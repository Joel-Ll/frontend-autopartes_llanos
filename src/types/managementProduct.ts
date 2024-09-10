import { z } from 'zod';

export type ProductManagementCreateForm = {
  productId: string;
  productPrice: number;
}

export const productManagementSchema = z.object({
  _id: z.string(),
  codeProduct: z.string(),
  productPrice: z.number(),
  productQuantity:z.number(),
  salesQuantity: z.number(),
  income: z.number(),
  expenses: z.number(),
});

export const productIncomeAndExpenses = z.array( productManagementSchema.pick({
  codeProduct: true,
  salesQuantity: true,
  income: true,
  expenses: true
}));


export const productsManagementSchema = z.array(productManagementSchema);

export type ProductManagement = z.infer<typeof productManagementSchema>

