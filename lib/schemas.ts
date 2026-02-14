/** @format */

// lib/schemas.ts
import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Product title is required"),
  desc: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  availableProduct: z.coerce
    .number()
    .int()
    .min(0, "Available product count must be a non-negative integer"),
  image: z.any().optional(), // File upload handling
});

export type ProductFormValues = z.infer<typeof productSchema>;
