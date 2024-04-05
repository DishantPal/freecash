import { assignBonus } from "./listeners/assignBonus";
import { sendEmailEvent } from "./listeners/sendWelcomeEmail";
import { sendActivitiesNotification } from "./listeners/sendUserActivities";

export const eventListeners: any = {
  user_registered: [sendEmailEvent],
  assign_bonus: [assignBonus],
  send_user_activity: [sendActivitiesNotification],
};
