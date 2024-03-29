import { db } from "../../../database/database";

export const fetch = async () => {
  const result = await db.selectFrom("menus").selectAll().execute();
  return result;
};
