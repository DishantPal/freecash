import { sql } from "kysely";
import { db } from "../../database/database";

export const getRefererCode = async (userId: number) => {
  const result = await db
    .selectFrom("users")
    .select(["referral_code"])
    .where("id", "=", userId)
    .executeTakeFirst();
  return result;
};
export const stats = async (userId: number) => {
  const referer_code = await getRefererCode(userId);
  if (!referer_code) throw new Error("Referer code not found");
  const result = await db
    .selectFrom("users")
    .select([sql`COUNT(*)`.as("total_users")])
    .where("referrer_code", "=", referer_code.referral_code)
    .executeTakeFirst();
  return result;
};
export const trends = async (userId: number) => {
  const referer_code = await getRefererCode(userId);
  if (!referer_code) throw new Error("Referer code not found");
  const result = await db
    .selectFrom("users")
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
    .where("referrer_code", "=", referer_code.referral_code)
    .execute();
  return result;
};
export const dateFormat = async () => {
  const query = await db
    .selectFrom("users")
    .select([
      sql`DATE_FORMAT(created_at,'%M_%Y')`.as("created_month_name"),
      sql`DATE_FORMAT(created_at,'%m_%Y')`.as("created_month_number"),
    ])
    .distinct()
    .execute();
  return query;
};

export const list = async (
  userId: number,
  date: string | null,
  pageNumber: number | null,
  limit: number | null
) => {
  const referer_code = await getRefererCode(userId);
  if (!referer_code) throw new Error("Referer code not found");
  const result = await db
    .selectFrom("users")
    .select(["id", "name", "email", "created_at"])
    .$if(date != null, (qb) =>
      qb.where(sql`DATE_FORMAT(created_at,"%m_%Y")`, "=", date)
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
    .where("referrer_code", "=", referer_code.referral_code)
    .execute();
  return result;
};
