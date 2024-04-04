// import { QueryCreator, sql } from "kysely";

import { db } from "../../../database/database";

interface UserPayment {
  payment_id: number;
  user_id: number;
  payment_method_code: string;
  account: string;
  payment_input: string;
  amount: number;
  cashback_amount?: number;
  bonus_amount?: number;
  status: "created" | "processing" | "completed" | "declined";
  api_response?: string;
  api_reference_id?: string;
  api_status?: string;
  note?: string;
  admin_note?: string;
  paid_at?: Date | null;
}
export const fetchTypes = async () => {
  const result = await db
    .selectFrom("payment_types")
    .select([
      "id",
      "code",
      "name",
      "image",
      "account_input_type",
      "account_input_label",
      "account_input_hint",
      "payment_inputs",
      "minimum_amount",
      "transaction_fees_amount",
      "transaction_fees_type",
      "transaction_bonus_amount",
      "transaction_bonus_type",
      "cashback_allowed",
      "bonus_allowed",
      "payment_group",
      "enabled",
    ])
    .execute();
  return result;
};
