import { sendWelcomeEmail } from "./listeners/sendWelcomeEmail";
// import  types pr write types here
export const eventListeners: any = {
  user_registered: [sendWelcomeEmail],
};
//  export const payloadTypes = ["user_registered"];
