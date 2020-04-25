import * as nodemailer from "nodemailer";
import { Transporter, TransportOptions } from "nodemailer";

interface IEmailOptions {
  email: string;
  message: string;
  subject: string;
}

const sendEmail = async (options: IEmailOptions) => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  } as TransportOptions);
  const mailOptions = {
    from: "Development <zhenya.masnyy@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
