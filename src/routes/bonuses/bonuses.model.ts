import { db } from "../../database/database";

export const fetch = async (user_id: number) => {
  const result = await db
    .selectFrom("user_bonus")
    .selectAll()
    .where("user_id", "=", user_id)
    .execute();
  return result;
};
