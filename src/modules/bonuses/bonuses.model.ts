import { db } from "../../database/database";

export const fetch = async (user_id: number) => {
  const result = await db
    .selectFrom("user_bonus")
    .selectAll()
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
