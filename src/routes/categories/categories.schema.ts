import { z } from "zod";

export const categoryItemSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  icon: z.string().nullable(),
  bg_color: z.string().nullable(),
  sort_order: z.number().nullable(),
});

export const categoriesSchema = z.array(categoryItemSchema);

export const fetchCategoryResponseSchema = z.object({
  success: z.string(),
  data: z.object({
    Categories: categoryItemSchema,
  }),
  error: z.string().nullable(),
  msg: z.string().nullable(),
});
