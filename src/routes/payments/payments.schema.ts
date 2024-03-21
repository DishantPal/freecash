import { z } from "zod";

const PaymentType = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  image: z.string(),
  account_input_type: z.string(),
  account_input_label: z.string(),
  account_input_hint: z.string(),
  payment_inputs: z.string(),
  minimum_amount: z.string(),
  transaction_fees_amount: z.string().nullable(),
  transaction_fees_type: z.string().nullable(),
  transaction_bonus_amount: z.string().nullable(),
  transaction_bonus_type: z.string().nullable(),
  cashback_allowed: z.number(),
  bonus_allowed: z.number(),
  payment_group: z.string(),
  enabled: z.number(),
});

export const fetchTypesResponseSchema = z.object({
  success: z.boolean(),
  types: z.array(PaymentType),
  error: z.string(),
  msg: z.string(),
});
