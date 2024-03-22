import { sql } from "kysely";
import { db } from "../../database/database";

export const fetch = async (type: "tasks" | "surveys", name: string) => {
  const result = db
    .selectFrom("offerwall_networks")
    .selectAll()
    .where("type", "=", type)
    .where("code", "=", name)
    .executeTakeFirst();
  return result;
};
