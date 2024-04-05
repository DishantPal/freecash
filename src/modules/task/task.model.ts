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
      "offerwall_categories.name as name",
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
  const cashbackCache = await app.redis.get("default_currency");
  if (cashbackCache) {
    const transformedData = await transformResponse(
      result,
      columns,
      "en",
      cashbackCache.toString()
    );
    return transformedData;
  }
};
export const columns = {
  translatable: ["Name", "description", "name", "instructions"],
  // hidden: ["ID", "status", "category_id"],
  money: ["payout"],
  date: ["created_at", "updated_at", "start_date", "end_date"],
};
export const list = async (
  countries: string[] | null,
  pageNumber: number | null,
  limit: number | null,
  platform: string[] | null,
  featured: number | null,
  network: string | null,
  category: number | null
) => {
  const result = await db
    .selectFrom(["offerwall_tasks"])
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
      "offerwall_tasks.payout",
      "offerwall_tasks.is_featured",
      "offerwall_networks.code",
      "offerwall_networks.name as network_name",
      "offerwall_networks.logo",
      "offerwall_categories.id",
      "offerwall_categories.icon",
      "offerwall_categories.name as name",
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
  const cashbackCache = await app.redis.get("default_currency");
  if (cashbackCache) {
    const transformedData = await transformResponse(
      result,
      columns,
      "en",
      cashbackCache.toString()
    );
    return transformedData;
  }
};
export const details = async (offer_id: string, userId: number) => {
  const goals = await db
    .selectFrom("offerwall_task_goals")
    .select(sql`COUNT(*)`.as("task_goals"))
    .where("task_offer_id", "=", offer_id)
    .executeTakeFirst();
  const completedGoals = await db
    .selectFrom("user_offerwall_sales")
    .select(sql`COUNT(*)`.as("completed_goals"))
    .where("task_offer_id", "=", offer_id)
    .where("user_id", "=", userId)
    .executeTakeFirst();
  console.log(await goals, await completedGoals);
  const task = await db
    .selectFrom(["offerwall_tasks"])
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
      "offerwall_tasks.payout",
      "offerwall_tasks.is_featured",
      "offerwall_networks.code",
      "offerwall_networks.name as network_name",
      "offerwall_networks.logo",
      "offerwall_categories.id",
      "offerwall_categories.icon",
      "offerwall_categories.name as name",
      "offerwall_categories.bg_color",
      "offerwall_categories.sort_order",
    ])
    .where("offerwall_tasks.offer_id", "=", offer_id)
    .executeTakeFirst();
  const cashbackCache = await app.redis.get("default_currency");
  if (cashbackCache) {
    const transformedData = await transformResponse(
      task,
      columns,
      "en",
      cashbackCache.toString()
    );
    return {
      ...transformedData,
      status:
        Number(completedGoals?.completed_goals) == 0
          ? "Not Started"
          : Number(goals?.task_goals) > Number(completedGoals?.completed_goals)
          ? "active"
          : Number(goals?.task_goals) == Number(completedGoals?.completed_goals)
          ? "completed"
          : "Not Started",
    };
  }
};
export const activeTask = async (userId: number) => {
  const goals = await db
    .selectFrom("offerwall_task_goals")
    .select(["task_offer_id", sql`COUNT(*)`.as("task_goals")])
    .groupBy("task_offer_id")
    .execute();
  const completedGoals = await db
    .selectFrom("user_offerwall_sales")
    .select(["task_offer_id", sql`COUNT(*)`.as("completed_goals")])
    .where("user_id", "=", userId)
    .groupBy("task_offer_id")
    .execute();
  // Create a map for completed goals for efficient lookup
  const completedGoalsMap = completedGoals.reduce((map: any, item: any) => {
    map[item.task_offer_id] = item.completed_goals;
    return map;
  }, {});

  const processedGoals = goals
    .map((goal) => {
      // Assume status as "Not Started" by default
      let status = "Not Started";

      if (completedGoalsMap.hasOwnProperty(goal.task_offer_id)) {
        const completed = completedGoalsMap[goal.task_offer_id] || 0; // Default to 0 if no entry
        status =
          Number(goal.task_goals) > Number(completed)
            ? "active"
            : Number(goal.task_goals) === Number(completed)
            ? "completed"
            : "Not Started";
      }

      // Return each goal with its status
      return { ...goal, status };
    })
    .filter((goal) => goal.status === "active");
  const activeTaskIds = processedGoals.map((goal) => goal.task_offer_id);
  if (!activeTaskIds.length) return null;
  const activeTasksDetails = await db
    .selectFrom(["offerwall_tasks"])
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
      "offerwall_tasks.payout",
      "offerwall_tasks.is_featured",
      "offerwall_networks.code",
      "offerwall_networks.name as network_name",
      "offerwall_networks.logo",
      "offerwall_categories.id",
      "offerwall_categories.icon",
      "offerwall_categories.name as name",
      "offerwall_categories.bg_color",
      "offerwall_categories.sort_order",
    ])
    .where("offer_id", "in", activeTaskIds)
    .execute();
  const enrichedActiveTasksDetails = activeTasksDetails.map((task) => ({
    ...task,
    status: "active",
  }));
  const cashbackCache = await app.redis.get("default_currency");
  if (cashbackCache) {
    const transformedData = await transformResponse(
      enrichedActiveTasksDetails,
      columns,
      "en",
      cashbackCache.toString()
    );
    const transformedActivetask = transformedData.map((i: any) => {
      return {
        ...i,
        status: "active",
      };
    });
    return transformedActivetask;
  }
};
