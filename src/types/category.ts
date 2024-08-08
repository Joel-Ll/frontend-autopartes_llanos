import { z } from 'zod';

export const categorySchema = z.object({
  _id: z.string(),
  name: z.string(),
});

export const categoriesSchema = z.array(categorySchema);
export type Category = z.infer<typeof categorySchema>;
export type CategoryCreateForm = Pick<Category, 'name'>