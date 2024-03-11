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
