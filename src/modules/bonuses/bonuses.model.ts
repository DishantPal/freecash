import { OperandValueExpressionOrList, sql } from "kysely";
import { db } from "../../database/database";
import { DB } from "../../database/db";

export const fetch = async (user_id: number,status:"confirmed" | "declined" | "pending"|null,date:string|null) => {
  const result = await db
    .selectFrom("user_bonus")
    .selectAll()
    .$if(date != null, (qb) => qb.where(sql`DATE_FORMAT(clicked_on,"%m_%Y")`,'=', date))
    .$if(status != null, (qb) => qb.where("status", "=", status))
    .where("user_id", "=", user_id)
    .execute();
  return result;
};
export const checkBonusStatus = async (userId: number) => {
  const check = await db
    .selectFrom("user_bonus")
    .select(["status"])
    .where("user_id", "=", userId)
    .executeTakeFirst();
  return check;
};
export const bonusDetails = async (type: string) => {
  const result = await db
    .selectFrom("bonus_types")
    .select(["code", "amount","validity_days"])
    .where("code", "=", type)
    .executeTakeFirst();
  return result;
};
export const dateFormat = async () => {
  const query = await db.selectFrom("user_bonus").select([sql`DATE_FORMAT(awarded_on,'%M_%Y')`.as("awarded_month_name"),sql`DATE_FORMAT(awarded_on,'%m_%Y')`.as("awarded_month_number"),sql`DATE_FORMAT(expires_on,'%M_%Y')`.as("expires_month_name"),sql`DATE_FORMAT(expires_on,'%m_%Y')`.as("expires_month_number"),sql`DATE_FORMAT(created_at,'%m %Y')`.as("created_month_number"),sql`DATE_FORMAT(created_at,'%M %Y')`.as("created_month_name")]).distinct().execute();
  return query;
};
export const stats = async (userId:number) => {
  const bonus_stats = await db
    .selectFrom("user_bonus")
    .select(["bonus_code", sql`count(*)`.as("task_type_count"),sql`SUM(amount)`.as("total_amount")])
    .groupBy("bonus_code")
    .where("user_id", "=", userId)
    .execute();
   const bonus_status = await db.selectFrom("user_bonus").select(["status",sql`count(*)`.as("status_count")]).groupBy("status").where("user_id", "=", userId).execute();
  return {
    bonus_stats,
    bonus_status
  };
}
export const fetchTrends = async(userId: number) => {
  const result = await db.selectFrom("user_bonus").select([
   sql` SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 ELSE 0 END)`.as(
     "clickedLastDay"
   ),
   sql`SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END)`.as(
     "clickedLast30Days"
   ),
   sql` SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 84 DAY) THEN 1 ELSE 0 END)`.as(
     "clickedLast84Days"
   ),
 ])
 return result;
}