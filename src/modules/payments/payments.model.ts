// import { QueryCreator, sql } from "kysely";

import { sql } from "kysely";
import { db } from "../../database/database";
import { UserPayment } from "./payments.schema";

export const fetchTypes = async () => {
  const result = await db.selectFrom("payment_types").selectAll().execute();
  return result;
};

export const fetch = async (
  pageNumber: number,
  limit: number,
  userId: number,
  type: string | null,
  status: "created" | "processing" | "completed" | "declined" | null,
  month_year: string | null
) => {
  const result = await db
    .selectFrom("user_payments")
    .selectAll()
    .$if(type != null, (qb) => qb.where("payment_method_code", "=", type))
    .$if(status != null, (qb) => qb.where("status", "=", status))
    .$if(month_year != null, (qb) =>
      qb.where(sql`DATE_FORMAT(paid_at,"%m_%Y")`, "=", month_year)
    )
    .$if(pageNumber !== undefined, (qb) =>
      qb
        .limit(limit ? limit : 20)
        .offset(
          limit && pageNumber
            ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
            : 20
        )
    )
    .where("user_id", "=", userId)
    .execute();
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

export const stats = async (id: number) => {
  const payout_count = await db
    .selectFrom("user_payments")
    .select(["status", sql`count(*)`.as("status_count")])
    .groupBy("status")
    .where("user_id", "=", id)
    .execute();
  const payout_amount = await db
    .selectFrom("user_payments")
    .select(["status", sql`SUM(amount)`.as("status_amount")])
    .groupBy("status")
    .where("user_id", "=", id)
    .execute();
  return {
    payout_count,
    payout_amount,
  };
};

export const dateFormat = async () => {
  const query = await db
    .selectFrom("user_payments")
    .select([
      sql`DATE_FORMAT(created_at,'%M_%Y')`.as("created_at_month_name"),
      sql`DATE_FORMAT(created_at,'%m_%Y')`.as("created_at_month_number"),
    ])
    .distinct()
    .execute();
  return query;
};

export const fetchTrends = async (userId: number) => {
  const result = await db
    .selectFrom("user_payments")
    .select([
      sql` SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 ELSE 0 END)`.as(
        "LastDay"
      ),
      sql`SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END)`.as(
        "Last7Days"
      ),
      sql` SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END)`.as(
        "Last30Days"
      ),
    ])
    .where("user_id", "=", userId)
    .execute();
  console.log(result);
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
