import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "Phone number is required"),
  customerAddr: z.string().min(8, "Address is required"),
  notes: z.string().optional(),
  items: z.array(checkoutItemSchema).min(1, "Cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
