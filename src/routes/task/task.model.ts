import { QueryCreator, sql } from "kysely";
import app from "../../app";
import { db } from "../../database/database";
import transformResponse from "../../utils/transformResponse";

export const fetch = async (
  countries: string[] | null,
  pageNumber: number | null,
  limit: number | null,
  platform: string[] | null,
  featured: number | null,
  network: string | null,
  category: number | null
) => {
  // Query:
  const result = await db
    .selectFrom([
      "offerwall_tasks",
      // "offerwall_networks",
      // "offerwall_categories",
    ])
    .leftJoin(
      "offerwall_networks",
      "offerwall_networks.name",
      "offerwall_tasks.network"
    )
    .leftJoin(
      "offerwall_categories",
      "offerwall_categories.id",
      "offerwall_tasks.category_id"
    )
    .select([
      "offerwall_tasks.id as task_id",
      "offerwall_tasks.name as Name",
      "offerwall_tasks.description",
      "offerwall_tasks.instructions",
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
      "offerwall_networks.name as network_name",
      "offerwall_networks.logo",
      "offerwall_categories.id",
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
    // .orderBy("offerwall_tasks.id", "asc")
    .execute();
  console.log(result);
  const cashbackCache = await app.redis.get("default_currency");
  console.log(cashbackCache);
  if (cashbackCache) {
    const transformedData = await transformResponse(
      result,
      columns,
      "en",
      cashbackCache.toString()
    );
    console.log(transformedData);
    return transformedData;
  }
};

export const columns = {
  translatable: ["Name", "description"],
  // hidden: ["ID", "status", "category_id"],
  money: ["payout"],
  date: ["created_at", "updated_at", "start_date", "end_date"],
};
