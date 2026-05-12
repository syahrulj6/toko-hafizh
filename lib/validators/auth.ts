import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email is invalid'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Email is invalid'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().regex(/^\+62\d{8,14}$/, 'Phone number must use +62 format'),
  address: z.string().min(8, 'Address is too short'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
