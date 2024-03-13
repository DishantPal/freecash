import { z } from "zod";

export const fetchResponseSchema = z.object({
  success: z.boolean(),
  settings: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      value: z.string().nullable(),
      group: z.string(),
    })
  ),
  error: z.string().nullable(),
  msg: z.string().nullable(),
});
export const querySchema = z.object({
  group: z.string(),
});
