import { QueryCreator, sql } from "kysely";
import app from "../../app";
import { db } from "../../database/database";

export const fetch = async (
  countries: string[] | null,
  pageNumber: number | null,
  limit: number | null,
  platform: string[] | null,
  featured: boolean | null,
  network: string | null,
  category: number | null
) => {
  // Query:
  const query = await db
    .selectFrom([
      "offerwall_tasks",
      "offerwall_networks",
      "offerwall_categories",
    ])
    .select([
      "offerwall_tasks.name as Name",
      "offerwall_tasks.description",
      "offerwall_tasks.instructions",
      "offerwall_tasks.id as ID",
      "offerwall_tasks.network",
      "offerwall_tasks.offer_id",
      "offerwall_tasks.category_id",
      "offerwall_tasks.image",
      "offerwall_tasks.url",
      "offerwall_tasks.countries",
      "offerwall_tasks.platforms",
      "offerwall_tasks.status",
      "offerwall_tasks.payout",
      "offerwall_tasks.is_featured",
      "offerwall_tasks.goals_count",
      "offerwall_tasks.network_goals",
      "offerwall_networks.code",
      "offerwall_networks.name",
      "offerwall_networks.logo",
      "offerwall_categories.id as category_id",
      "offerwall_categories.icon",
      "offerwall_categories.name as category_name",
      "offerwall_categories.bg_color",
      "offerwall_categories.sort_order",
    ])
    .$if(network?.length != null, (qb) =>
      qb.where("offerwall_tasks.network", "=", network)
    )
    .$if(platform?.length != null, (qb) =>
      qb.where(sql<any>`
    JSON_CONTAINS(offerwall_tasks.platforms, JSON_ARRAY(${platform}))`)
    )
    .$if(countries != null, (qb) =>
      qb.where(sql<any>`
    JSON_CONTAINS(offerwall_tasks.countries, JSON_ARRAY(${countries}))
  `)
    )
    .$if(featured != null, (qb) =>
      qb.where("offerwall_tasks.is_featured", "=", Number(featured))
    )
    .$if(category != null, (qb) =>
      qb.where("offerwall_tasks.category_id", "=", category)
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
    .execute();
  return query;
};
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
