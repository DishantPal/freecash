import { sendEmail } from "../../utils/sendEmail";
interface EventPayload {
  [key: string]: any;
}
export const sendEmailEvent = async (payload: EventPayload) => {
  await sendEmail(
    payload.fromEmail,
    payload.toEmail,
    payload.subject,
    payload.text,
    payload.link
  );
};
