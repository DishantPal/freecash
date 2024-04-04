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
          amount: z.string(),
          awarded_on: z
            .string()
            .transform((val) => new Date(val))
            .nullable(),
          expires_on: z
            .string()
            .transform((val) => new Date(val))
            .nullable(),
          referred_bonus_id: z.number().nullable().optional(),
          status: z.string(),
        })
      ),
    })
    .optional(),
  error: z.union([z.string(), z.null()]).optional(),
  msg: z.union([z.string(), z.null()]).optional(),
});
export const fetchQueryResponse = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  status: z.enum(["confirmed", "declined", "pending"]).optional(),
  date: z.string().optional().describe("Date in MM_YYYY format"),
});
