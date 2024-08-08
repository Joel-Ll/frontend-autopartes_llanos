import { z } from 'zod';

export const customerSchema = z.object({
  _id: z.string(),
  name: z.string(),
  nit_ci: z.string(),
  phone: z.string(),
  address: z.string()
});
export const customersSchema = z.array(customerSchema);
export type Customer = z.infer<typeof customerSchema>;
export type CustomerCreateForm = Pick<Customer, 'name' | 'nit_ci' | 'phone' | 'address'>