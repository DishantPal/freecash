import { sql } from "kysely";
import { db } from "../../database/database";

export const fetchStats = async () => {
  const confirmedEarningsResult = await db
    .selectFrom(["user_offerwall_sales", "user_bonus"])
    .select([
      sql`sum(case when user_offerwall_sales.status = 'confirmed' then user_offerwall_sales.payout else 0 end + case when user_bonus.status = 'confirmed' then user_bonus.amount else 0 end)`.as(
        "totalConfirmed"
      ),
    ])
    .execute();
  const confirmedEarnings = confirmedEarningsResult[0]?.totalConfirmed || 0;

  const pendingEarningsResult = await db
    .selectFrom(["user_offerwall_sales", "user_bonus"])
    .select([
      sql`sum(case when user_offerwall_sales.status = 'pending' then user_offerwall_sales.payout else 0 end + case when user_bonus.status = 'pending' then user_bonus.amount else 0 end)`.as(
        "totalPending"
      ),
    ])
    .execute();
  const pendingEarnings = pendingEarningsResult[0]?.totalPending || 0;

  const paymentsResult = await db
    .selectFrom("user_payments")
    .select([
      sql`sum(case when status = 'completed' then amount else 0 end)`.as(
        "totalPaid"
      ),
      sql`sum(case when status in ('processing', 'created') then amount else 0 end)`.as(
        "inProgressPayments"
      ),
    ])
    .execute();
  const { totalPaid, inProgressPayments } = paymentsResult[0];

  const offerCompletedResult = await db
    .selectFrom("user_offerwall_sales")
    .select(sql`count(*)`.as("offerCount"))
    .where("status", "=", "confirmed")
    .execute();
  const offerCompleted = offerCompletedResult[0]?.offerCount || 0;

  const earningsInPeriods = await db
    .selectFrom("user_payments")
    .select([
      sql`sum(case when created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) then amount else 0 end)`.as(
        "earningsLastDay"
      ),
      sql`sum(case when created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) then amount else 0 end)`.as(
        "earningsLastWeek"
      ),
      sql`sum(case when created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) then amount else 0 end)`.as(
        "earningsLastMonth"
      ),
    ])
    .where("status", "=", "completed")
    .execute();
  const { earningsLastDay, earningsLastWeek, earningsLastMonth } =
    earningsInPeriods[0];
  return {
    confirmedEarnings,
    pendingEarnings,
    payout: { totalPaid, inProgressPayments },
    offerCompleted,
    earningsLastDay,
    earningsLastWeek,
    earningsLastMonth,
  };
};
