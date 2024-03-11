import { z } from "zod";

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
