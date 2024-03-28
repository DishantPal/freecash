import { db } from "../../database/database";

interface EventPayload {
  user_id: number;
  amount: number;
  bonus_code: string;
  expires_on: string;
  referred_bonus_id: number;
  status: "pending" | "confirmed" | "declined";
}
export const assignBonus = async (payload: EventPayload) => {
  const expiresOnDate: Date = new Date(payload.expires_on);
  await db
    .insertInto("user_bonus")
    .values({
      user_id: payload.user_id,
      amount: payload.amount,
      bonus_code: payload.bonus_code,
      expires_on: expiresOnDate,
      referred_bonus_id: payload.referred_bonus_id,
      status: "pending",
    })
    .execute();
};
