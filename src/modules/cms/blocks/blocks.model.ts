import { db } from "../../../database/database";

export const fetch = async () => {
  const result = await db.selectFrom("blocks").selectAll().execute();
  return result;
};
