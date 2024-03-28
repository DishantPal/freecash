import collect from "collect.js";
import { db } from "../../database/database";
import { sql } from "kysely";

const checkJoinNoReferBonus = async () => {
  const bonusDetails = await db
    .selectFrom("bonus_types")
    .selectAll()
    .where("code", "=", "join_no_refer")
    .executeTakeFirst();
  const userBonuses = collect(
    await db
      .selectFrom("user_bonus")
      .selectAll()
      .where("bonus_code", "=", "join_no_refer")
      .where("status", "=", "pending")
      .groupBy("user_id")
      .execute()
  );
  const userBonusUnique = userBonuses.unique("user_id");
  userBonusUnique.all();
  console.log(userBonusUnique);
  // const userPayments = collect(knex(user_tasks).whereIn(user_id, userIdsFromUserBonuses).where(status, confirmed))
  //   .groupBy('user_id')
  //   .sum('amount')
  const userPayments = await db
    .selectFrom("user_offerwall_sales")
    .select([
      "user_id", // Ensure you're selecting user_id
      sql`sum(case when user_offerwall_sales.status = 'confirmed' then user_offerwall_sales.payout else 0 end)`.as(
        "totalConfirmed"
      ),
    ])
    .groupBy("user_id")
    .execute();
  console.log(userPayments);
  //   // {1: 12, 2: 321, }
  userBonusUnique.map(async (i) => {
    if (bonusDetails) {
      if (Number(i.amount) >= Number(bonusDetails.amount)) {
        await db
          .updateTable("user_bonus")
          .set({ status: "confirmed" })
          .where("user_id", "=", i.user_id)
          .execute();
      }
      //Activities Insert
    }
  });
};
const checkJoinWithReferBonus = async () => {
  const bonusDetails = await db
    .selectFrom("bonus_types")
    .selectAll()
    .where("code", "=", "join_with_refer")
    .executeTakeFirst();
  const userBonuses = collect(
    await db
      .selectFrom("user_bonus")
      .selectAll()
      .where("bonus_code", "=", "join_with_refer")
      .where("status", "=", "pending")
      .groupBy("user_id")
      .execute()
  );
  const userBonusUnique = userBonuses.unique("user_id");
  userBonusUnique.all();
  console.log(userBonusUnique);
  // const userPayments = collect(knex(user_tasks).whereIn(user_id, userIdsFromUserBonuses).where(status, confirmed))
  //   .groupBy('user_id')
  //   .sum('amount')
  const userPayments = await db
    .selectFrom("user_offerwall_sales")
    .select([
      "user_id", // Ensure you're selecting user_id
      sql`sum(case when user_offerwall_sales.status = 'confirmed' then user_offerwall_sales.payout else 0 end)`.as(
        "totalConfirmed"
      ),
    ])
    .groupBy("user_id")
    .execute();
  console.log(userPayments);
  //   // {1: 12, 2: 321, }
  userBonusUnique.map(async (i) => {
    if (bonusDetails) {
      if (Number(i.amount) >= Number(bonusDetails.amount)) {
        await db
          .updateTable("user_bonus")
          .set({ status: "confirmed" })
          .where("bonus_code", "=", "join_with_refer")
          .where("user_id", "=", i.user_id)
          .execute();
      }
    }
  });
  //Activities Insert
};
const checkReferBonus = async () => {
  const bonusDetails = await db
    .selectFrom("bonus_types")
    .selectAll()
    .where("code", "=", "refer_bonus")
    .executeTakeFirst();
  const userBonuses = collect(
    await db
      .selectFrom("user_bonus")
      .selectAll()
      .where("bonus_code", "=", "refer_bonus")
      .where("status", "=", "pending")
      .groupBy("user_id")
      .execute()
  );
  const userBonusUnique = userBonuses.unique("user_id");
  userBonusUnique.all();
  console.log(userBonusUnique);
  // const userPayments = collect(knex(user_tasks).whereIn(user_id, userIdsFromUserBonuses).where(status, confirmed))
  //   .groupBy('user_id')
  //   .sum('amount')
  const userPayments = await db
    .selectFrom("user_offerwall_sales")
    .select([
      "user_id", // Ensure you're selecting user_id
      sql`sum(case when user_offerwall_sales.status = 'confirmed' then user_offerwall_sales.payout else 0 end)`.as(
        "totalConfirmed"
      ),
    ])
    .groupBy("user_id")
    .execute();
  console.log(userPayments);
  //   // {1: 12, 2: 321, }
  userBonusUnique.map(async (i) => {
    if (bonusDetails) {
      if (Number(i.amount) >= Number(bonusDetails.amount)) {
        await db
          .updateTable("user_bonus")
          .set({ status: "confirmed" })
          .where("bonus_code", "=", "refer_bonus")
          .where("user_id", "=", i.user_id)
          .execute();
      }
    }
  });
  //Activities Insert
};

export default async () => {
  await Promise.all([
    checkJoinNoReferBonus(),
    checkJoinWithReferBonus(),
    checkReferBonus(),
  ]);
};
// main().then(() => console.log("done"));
