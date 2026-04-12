import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().url("Image must be a valid URL"),
  price: z.number().int().min(1, "Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  isActive: z.boolean(),
});

export type ProductInput = z.infer<typeof productSchema>;
