import { db } from "../../database/database";
import { activityConfig } from "../../config/activityConfig";

interface EventPayload UserBonus;


export const bonusCreated = async (payload: UserBonus) => {

    const userBonus = payload;

    const userActivityObj = {
        user_id: userBonus.user_id,
        activity_type: "bonus_earnings",
        icon: activityConfig.bonus_earnings.icon,
        title: activityConfig.bonus_earnings.title_status_confirmed,
        status: "confirmed",
        url: activityConfig.bonus_earnings.url,
        amount: userBonus.amount,
        data: JSON.stringify({ message: "Referral Code Bonus  Confirmed" }),
      }

  // In App notification
  const activity = await db
    .insertInto("user_activities")
    .values(userActivityObj)
    .execute();

  // Mail Notification
  sendEmail('bonus.created', {})

  // Push
};
