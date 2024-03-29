import { db } from "../../../database/database";

export const fetch = async () => {
  const result = await db.selectFrom("pages").selectAll().execute();
  return result;
};
