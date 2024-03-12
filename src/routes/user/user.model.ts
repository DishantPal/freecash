import { db } from "../../database/database";
export const findUser = async (id: number) => {
  const result = db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
  return result;
};
export const updateUser = async (
  id: number,
  email?: string,
  password?: string,
  name?: string
) => {
  const result = db
    .updateTable("users")
    .set({
      name: name,
      email: email,
      password: password,
    })
    .where("id", "=", id)
    .execute();
  return result;
};
