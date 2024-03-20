import { sendEmail } from "../../utils/sendEmail";
interface EventPayload {
  [key: string]: any;
}
export const sendWelcomeEmail = async (payload: EventPayload) => {
  await sendEmail(
    payload.fromEmail,
    payload.toEmail,
    payload.subject,
    payload.text,
    payload.link
  );
};
