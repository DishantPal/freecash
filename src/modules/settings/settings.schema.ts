import { z } from "zod";

const dataItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  value: z.union([z.string(), z.null()]), // since 'value' can be a string or null
  group: z.string(),
});

export const responseSchema = z.object({
  success: z.boolean(),
  data: z.array(dataItemSchema),
  error: z.union([z.string(), z.literal("null")]), // 'error' as a string or the string "null"
  msg: z.union([z.string(), z.literal("null")]), // 'msg' as a string or the string "null"
});

export const querySchema = z.object({
  group: z.string(),
});
