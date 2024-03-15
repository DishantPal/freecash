import { z } from "zod";

export const querySchema=z.object({
    provider: z.string(),
    country: z.string(),
    sort: z.string().optional(),
    page: z.string().default("1"),
  });
const surveySchema = z.object({
  id: z.string(),
  network: z.string(),
  campaign_id: z.string(),
  title: z.string(),
  length_loi: z.number(),
  payout: z.number(),
  score: z.number(),
  rating: z.number(),
  rating_count: z.number(),
  type: z.enum(['survey']),
  link: z.string().url(),
  category_name: z.string(),
  category_icon: z.string().url(),
  category_icon_name: z.string()  
});

const paginationSchema = z.object({
  page: z.string(),
  perPage: z.number(),
  total: z.number()
});

export const responseSchema = z.object({
  success: z.boolean(),
  data: z.array(surveySchema),
  error: z.string().nullable(),
  msg: z.string().nullable(),
  pagination: paginationSchema
});
