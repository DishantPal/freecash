import { sendEmail } from "../utils/sendEmail";
import { eventBus } from "./eventBus";
const emailEvent = eventBus;
// Setup listener
export const emailEvents = (payload: any) => {
  emailEvent.on("sendEmail", async () => {
    try {
      console.log("Sending email with payload:", payload);
      // Simulate sending email
      await sendEmail(
        payload.fromEmail,
        payload.toEmail,
        payload.subject,
        payload.text,
        payload.link
      );
      console.log("Email sent.");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  });
  emailEvent.emit("sendEmail", {
    fromEmail: payload.fromEmail,
    toEmail: payload.toEmai,
    subject: payload.subject,
    text: payload.text,
    link: payload.link,
  });
};
export default emailEvents;
