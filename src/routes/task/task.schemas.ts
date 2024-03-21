import { z } from "zod";
const GoalSchema = z.object({
  id: z.string(),
  name: z.string(),
  payout: z.number(),
  cashback: z.number(),
});

const CategorySchema = z.object({
  name: z.string(),
  id: z.number(),
  icon: z.string().nullable(),
  bg_color: z.string(),
  sort_order: z.number(),
});

const ProviderSchema = z.object({
  code: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
});

const TaskSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  instructions: z.string(),
  network: z.string(),
  offer_id: z.string(),
  category_id: z.number(),
  image: z.string().url(),
  url: z.string().url(),
  payout: z.string(),
  countries: z.array(z.string()),
  platforms: z.array(z.string()),
  status: z.string(),
  is_featured: z.number(),
  goals_count: z.number(),
  goals: z.array(GoalSchema),
  provider: ProviderSchema,
  category: CategorySchema,
});

export const ApiResponseSchema = z.object({
  success: z.boolean().default(true),
  data: z.object({
    tasks: z.array(TaskSchema),
  }),
  error: z.string().nullable(),
  msg: z.string().nullable(),
});

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

export const zodTaskItemSchema = z.object({
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

export const tasksSchema = z.array(zodTaskItemSchema, taskProviderSchema);

export const zodFetchTaskResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(tasksSchema),
  error: z.string().nullable(),
  msg: z.string().nullable(),
});

export const fetchTaskQuerySchema = z.object({
  countries: z.string().optional().nullable(),
  page_number: z.string().nullable().default("1"),
  limit: z.string().nullable().default("20"),
  platform: z.string().optional().nullable(),
  featured: z.string().nullable().optional(),
  network: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
});

export type FetchTaskQuery = z.infer<typeof fetchTaskQuerySchema>;
