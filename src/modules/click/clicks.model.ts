import { sql } from "kysely";
import { db } from "../../database/database";
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
  network: string,
  task_type: string,
  platform: string
) => {
  const query = await db
    .selectFrom("user_task_clicks")
    .selectAll()
    .$if(network != null, (qb) => qb.where("network", "=", network))
    .$if(task_type != null, (qb) => qb.where("task_type", "=", task_type))
    .$if(platform != null, (qb) => qb.where("platform", "=", platform))
    .execute();
  return query;
};
export const clickCount = async () => {
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
    .groupBy("network")
    .execute();
  return {
    task_type_count,
    platform_count,
    network_count,
  };
};
clickCount();
