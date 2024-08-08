import { z } from 'zod';

export const supplierSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string()
});
export const suppliersSchema = z.array(supplierSchema);
export type Supplier = z.infer<typeof supplierSchema>;
export type SupplierCreateForm = Pick<Supplier, 'name' | 'email' | 'phone' | 'address'>