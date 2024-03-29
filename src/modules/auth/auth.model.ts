import { UpdateResult } from "kysely";
import { db } from "../../database/database";

export const register = async (
  name: string,
  email: string,
  password: string,
  referral: string
) => {
  const result = db
    .insertInto("users")
    .values({
      email: email,
      name: name,
      password: password,
      referral_code: referral,
    })
    .executeTakeFirst();
  return result;
};
export const registerSocial = async (
  name: string,
  email: string,
  googleId: string | null,
  facebookId: string | null,
  referral: string
) => {
  const result = db
    .insertInto("users")
    .values({
      email: email,
      name: name,
      googleId: googleId,
      facebookId: facebookId,
      is_verified: 1,
      referral_code: referral,
    })
    .execute();

  return result;
};

export const login = async (email: string) => {
  const result = db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();
  return result;
};

export const updateIsVerified = async (
  email: string
): Promise<UpdateResult> => {
  const userUpdate = await db
    .updateTable("users")
    .set({
      is_verified: 1,
    })
    .where("email", "=", `${email}`)
    .executeTakeFirst();
  return userUpdate;
};
export const updatePassword = async (
  email: string | undefined,
  password: string
) => {
  const userUpdate = await db
    .updateTable("users")
    .set({
      password: password,
    })
    .where("email", "=", `${email}`)
    .executeTakeFirst();
  return userUpdate;
};
