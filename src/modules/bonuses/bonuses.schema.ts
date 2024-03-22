import { z } from "zod";

export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      bonuses: z.array(
        z.object({
          id: z.number(),
          user_id: z.number(),
          bonus_code: z.string(),
          amount: z.string(), // Confirm this should be a string, not a number
          awarded_on: z.date(), // Ensure this matches your date format
          expires_on: z.date(), // Ensure this matches your date format
          referred_bonus_id: z.number().nullable().optional(),
          status: z.string(),
        })
      ),
    })
    .optional(), // If the whole data object can be optional
  error: z.union([z.string(), z.null()]).optional(), // If error can be a string or null
  msg: z.union([z.string(), z.null()]).optional(), // If msg can be a string or null
});
