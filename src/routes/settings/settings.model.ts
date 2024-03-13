import { db } from "../../database/database";

export const fetch = async (group: string) => {
  const result = db
    .selectFrom("settings")
    .selectAll()
    .where("group", "=", group)
    .execute();
  return result;
};
