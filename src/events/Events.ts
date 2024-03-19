import { sendRegisterEmail } from "./listeners/sendWelcomeEmail";

export const eventListeners: any = {
  user_registered: [sendRegisterEmail],
};
