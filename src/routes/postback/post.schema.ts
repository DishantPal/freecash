import { z } from "zod";

export const postbackSchema = z.object({
  type: z.enum(["tasks", "surveys"]),
  network: z.string(),
  transaction_id: z.string(),
  user_id: z.string(),
  offer_name: z.string(),
  offer_id: z.string(),
  amount: z.string(),
  payout: z.string(),
  network_goal_id: z.string(),
  ikey: z.string(),
  hash: z.string(),
});
export type postbackQuerySchema = z.infer<typeof postbackSchema>;
