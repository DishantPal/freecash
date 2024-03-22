// import { QueryCreator, sql } from "kysely";

import { db } from "../../database/database";
import { UserPayment } from "./payments.schema";

export const fetchTypes = async () => {
  const result = await db.selectFrom("payment_types").selectAll().execute();
  return result;
};
export const insert = async (data: UserPayment) => {
  try {
    const result = await db
      .insertInto("user_payments")
      .values({
        payment_id: data.payment_id,
        user_id: data.user_id,
        payment_method_code: data.payment_method_code,
        account: data.account,
        payment_input: data.payment_input,
        amount: data.amount,
        cashback_amount: data.cashback_amount,
        bonus_amount: data.bonus_amount,
        status: data.status,
        api_response: data.api_response,
        api_reference_id: data.api_reference_id,
        api_status: data.api_status,
        note: data.note,
        admin_note: data.admin_note,
        paid_at: data.paid_at,
      })
      .execute();
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const fetchAmount = async (id: number) => {
  const bonus = await db
    .selectFrom("user_bonus")
    .select(["user_bonus.amount as bonus"])
    .where("user_bonus.user_id", "=", id)
    .executeTakeFirst();
  const amount = await db
    .selectFrom("user_offerwall_sales")
    .select(["user_offerwall_sales.amount as amount"])
    .where("user_offerwall_sales.user_id", "=", id)
    .executeTakeFirst();
  console.log(amount, bonus);
  if (amount && bonus) {
    return {
      bonus: bonus.bonus,
      amount: amount.amount,
      total: Number(amount.amount) + Number(bonus.bonus),
    };
  } else {
    return {
      bonus: 0,
      amount: 0,
      total: 0,
    };
  }
};
export const fetchType = async (code: string) => {
  const result = await db
    .selectFrom("payment_types")
    .select(["code", "minimum_amount"])
    .where("code", "=", code)
    .executeTakeFirst();
  return result;
};
