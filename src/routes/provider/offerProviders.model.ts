import { sql } from "kysely";
import { db } from "../../database/database";

export const fetch = async () => {
  const result = await db
    .selectFrom("offerwall_networks")
    .select(["id", "name", "code", "logo"])
    .execute();
  return result;
};
