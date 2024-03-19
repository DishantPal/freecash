import { sendEmail } from "../../utils/sendEmail";

export const sendRegisterEmail = async (payload: any) => {
  sendEmail(
    payload.fromEmail,
    payload.toEmail,
    payload.subject,
    payload.text,
    payload.link
  );
};
