import { assignBonus } from "./listeners/assignBonus";
import { sendWelcomeEmail } from "./listeners/sendWelcomeEmail";
// import  types pr write types here
export const eventListeners: any = {
  user_registered: [sendWelcomeEmail],
  assign_bonus: [assignBonus],
};
//  export const payloadTypes = ["user_registered"];
