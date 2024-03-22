import { z } from "zod";

const categoryItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string().nullable(), // Assuming 'icon' can be null
  bg_color: z.string(),
  sort_order: z.number(),
});

const categoriesSchema = z.object({
  categories: z.array(categoryItemSchema), // Corrected to match the key in the JSON response and removed unnecessary array wrapping
});

export const fetchCategoryResponseSchema = z.object({
  success: z.boolean(),
  data: categoriesSchema, // Use the corrected categoriesSchema
  error: z.string().nullable().default(null), // Assuming 'error' can be null, using default() to handle actual null values
  msg: z.string().nullable().default(null), // Assuming 'msg' can be null, using default() to handle actual null values
});
