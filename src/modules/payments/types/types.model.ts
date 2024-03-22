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
  const result = await db.selectFrom("payment_types").selectAll().execute();
  return result;
};
export const fetchType = async (code: string) => {
  const result = await db
    .selectFrom("payment_types")
    .select(["code", "minimum_amount"])
    .where("code", "=", code)
    .executeTakeFirst();
  return result;
};
