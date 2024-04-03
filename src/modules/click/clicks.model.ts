import { sql } from "kysely";
import { db } from "../../database/database";
import { date } from "zod";
export const clickInsert = async (
  userId: number,
  platform: string,
  task_type: string,
  network: string,
  task_offer_id: string,
  campaign_id: string,
  locale: string,
  countries: string,
  userAgent: string,
  referer: string
) => {
  const query = await db
    .insertInto("user_task_clicks")
    .values({
      user_id: userId,
      platform: platform,
      task_type: task_type,
      network: network,
      task_offer_id: task_offer_id,
      campaign_id: campaign_id,
      locale: locale,
      countries: countries,
      user_agent: userAgent,
      Referer: referer,
    })
    .execute();
  return query;
};
export const fetch = async (
  network: string | null,
  task_type: string | null,
  platform: string | null,
  date: string | null,
  userId:number
) => {
  const query = await db
    .selectFrom("user_task_clicks")
    .selectAll()
    .$if(date != null, (qb) => qb.where(sql`DATE_FORMAT(clicked_on,"%m_%Y")`,'=', date))
    .$if(network != null, (qb) => qb.where("network", "=", network))
    .$if(task_type != null, (qb) => qb.where("task_type", "=", task_type))
    .$if(platform != null, (qb) => qb.where("platform", "=", platform))
    .where("user_id", "=", userId)
    .execute();
  return query;
};
export const clickStats = async (userId: number) => {
  const task_type_count = await db
    .selectFrom("user_task_clicks")
    .select(["task_type", sql`count(*)`.as("task_type_count")])
    .groupBy("task_type")
    .execute();
  const platform_count = await db
    .selectFrom("user_task_clicks")
    .select(["platform", sql`count(*)`.as("platform_count")])
    .groupBy("platform")
    .execute();
  const network_count = await db
    .selectFrom("user_task_clicks")
    .select(["network", sql`count(*)`.as("network_count")])
    .where('user_id','=',userId)
    .groupBy("network")
    .execute();
  return {
    task_type_count,
    platform_count,
    network_count,
  };
};
export const fetchTrends = async(userId: number) => {
 const result = await db.selectFrom("user_task_clicks").select([
  sql` SUM(CASE WHEN clicked_on >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 ELSE 0 END)`.as(
    "clickedLastDay"
  ),
  sql`SUM(CASE WHEN clicked_on >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END)`.as(
    "clickedLast30Days"
  ),
  sql` SUM(CASE WHEN clicked_on >= DATE_SUB(NOW(), INTERVAL 84 DAY) THEN 1 ELSE 0 END)`.as(
    "clickedLast84Days"
  ),
])
// .where("user_id","=",userId)
.execute();
console.log(result);
 return result;
};
export const dateFormat = async () => {
  const query = await db.selectFrom("user_task_clicks").select([sql`DATE_FORMAT(clicked_on,'%M_%Y')`.as("clicked_month_name"),sql`DATE_FORMAT(clicked_on,'%m_%Y')`.as("clicked_month_number")]).distinct().execute();
  console.log(await query);
  return query;
};
