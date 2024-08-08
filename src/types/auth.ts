import { z } from 'zod';

export const authSchema = z.object({
  name: z.string(),
  password: z.string(),
});

export type Auth = z.infer<typeof authSchema>;
export type UserLoginForm = Pick<Auth, 'name' | 'password'>