import { sendEmail } from "../utils/sendEmail";
import { eventBus } from "./eventBus";
const emailEvent = eventBus;
// Setup listener
emailEvent.on("sendEmail", async (payload) => {
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
export default emailEvent;
