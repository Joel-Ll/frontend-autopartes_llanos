import { z } from 'zod';

export const productSchema = z.object({
  _id: z.string(),
  category: z.string(),
  name: z.string(),
  code: z.string(),
  description: z.string(),
  salePrice: z.number(),
  stock: z.number(),
  state: z.string()
});
export const productSchemaFilter = productSchema.pick({
  _id: true,
  name: true,
  code: true,
  description: true,
  category: true,
});

export const productsSchema = z.array(productSchema);
export type Product = z.infer<typeof productSchema>;
export type ProductCreateForm = Pick<Product, 'category' | 'name' | 'code' | 'description'>
export type ProductFilter = z.infer<typeof productSchemaFilter> | null