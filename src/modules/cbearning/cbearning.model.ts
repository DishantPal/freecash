import { sql } from "kysely";
import { db } from "../../database/database";
export const stats = async (userId: number) => {
  const result = await db
    .selectFrom("user_offerwall_sales")
    .select([
      "status",
      "task_type",
      "network",
      sql`COUNT(*)`.as("earnings_count"),
      sql`SUM(amount)`.as("earnings_amount"),
    ])
    .groupBy(["status", "task_type", "network"])
    .where("user_id", "=", userId)
    .execute();
  return result;
};
export const trends = async (userId: number) => {
  const result = await db
    .selectFrom("user_offerwall_sales")
    .select([
      sql` SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 ELSE 0 END)`.as(
        "LastDay"
      ),
      sql` SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END)`.as(
        "Last7Days"
      ),
      sql`SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END)`.as(
        "Last30Days"
      ),
    ])
    .where("user_id", "=", userId)
    .execute();
  return result;
};
export const lists = async (
  userId: number,
  task_type: string | null,
  network: string | null,
  status: "pending" | "confirmed" | "declined" | null,
  month_year: string | null,
  limit: number | null,
  pageNumber: number | undefined
) => {
  const result = await db
    .selectFrom("user_offerwall_sales")
    .selectAll()
    .$if(month_year != null, (qb) =>
      qb.where(sql`DATE_FORMAT(created_at,"%m_%Y")`, "=", month_year)
    )
    .$if(network != null, (qb) => qb.where("network", "=", network))
    .$if(status != null, (qb) => qb.where("status", "=", status))
    .$if(task_type != null, (qb) => qb.where("task_type", "=", task_type))
    .where("user_id", "=", userId)
    .$if(pageNumber !== undefined, (qb) =>
      qb
        .limit(limit ? limit : 20)
        .offset(
          limit && pageNumber
            ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
            : 20
        )
    )
    .execute();
  return result;
};
export const dateFormat = async () => {
  const query = await db
    .selectFrom("user_offerwall_sales")
    .select([
      sql`DATE_FORMAT(created_at,'%M_%Y')`.as("created_month_name"),
      sql`DATE_FORMAT(created_at,'%m_%Y')`.as("created_month_number"),
    ])
    .distinct()
    .execute();
  return query;
};
