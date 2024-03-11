import { z } from "zod";

export const taskGoalSchema = z.object({
  name: z.string(),
  description: z.string(),
  id: z.string(),
  payout: z.number(),
});

export const taskCategorySchema = z.object({
  name: z.string(),
  id: z.number(),
  icon: z.string().nullable(),
  bg_color: z.string(),
  sort_order: z.number(),
});

export const taskProviderSchema = z.object({
  code: z.string(),
  name: z.string(),
  icon: z.string(),
});

export const taskItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  instructions: z.string(),
  id: z.number(),
  network: z.string(),
  offer_id: z.string(),
  category_id: z.number(),
  image: z.string(),
  url: z.string(),
  payout: z.string(),
  countries: z.array(z.string()),
  platforms: z.array(z.string()),
  status: z.string(),
  is_featured: z.number(),
  goals_count: z.number(),
  goals: z.array(taskGoalSchema),
  provider: taskProviderSchema,
  category: taskCategorySchema,
});

export const tasksSchema = z.array(taskItemSchema, taskProviderSchema);

export const fetchTaskResponseSchema = z.object({
  success: z.string(),
  data: z.object({
    tasks: tasksSchema,
  }),
  error: z.string().nullable(),
  msg: z.string().nullable(),
});

export const fetchTaskQuerySchema = z.object({
  countries: z.string().optional(),
  page_number: z.number().default(1),
  limit: z.number(),
  platform: z.string().optional(),
  featured: z.boolean().default(false),
  network: z.string().optional(),
  category: z.number().optional(),
});
export const clickTaskSchema = z.object({
  platform: z.string().max(50),
  task_type: z.string().max(25),
  network: z.string().max(25),
  task_offer_id: z.string().max(50).nullable(),
  campaign_id: z.string().max(50),
});
export const clickTaskQuerySchema = z.object({
  platform: z.string().max(50),
  task_type: z.string().max(25),
  network: z.string().max(25),
  campaign_id: z.string().max(50),
});

export type ClickTaskQuery = z.infer<typeof clickTaskSchema>;
export type FetchTaskQuery = z.infer<typeof fetchTaskQuerySchema>;
