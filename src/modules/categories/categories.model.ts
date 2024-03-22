import { sql } from "kysely";
import app from "../../app";
import { db } from "../../database/database";
export const fetch = async () => {
  const result = db
    .selectFrom("offerwall_categories")
    .select(["id", "name", "icon", "bg_color", "sort_order"])
    .orderBy("sort_order asc")
    .execute();
  return result;
};
