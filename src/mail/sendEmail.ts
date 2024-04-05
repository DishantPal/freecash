import nodemailer from "nodemailer";
import { config } from "../config/config";
import { mailconfig } from "../mailconfig";

let transport = nodemailer.createTransport({
    host: config.env.app.emailHost,
    port: config.env.app.mailPort,
    auth: {
      user: config.env.app.emailUser,
      pass: config.env.app.emailPass,
    },
});

export const sendEmailViaTransport = async ({
    fromEmail,
    toEmail,
    subject,
    text,
}) => {
    await transport.sendMail({
        from: fromEmail,
        to: toEmail,
        subject: subject,
        html: content,
      });
}

const sendEmail = async <T>(name:string, toEmail:string, data: T) => {
  const mailSubjectName = mailconfig[name]['subject'](data);
  const mailTemplateName = mailconfig[name]['template'](data);
  
  const fromEmail = config['smtp.fromemail'];

  await sendEmailViaTransport();
}


// sendEmail('user.verifyemail', {username: user.name, toEmail: user.email, {emailverfiylink: ""}})