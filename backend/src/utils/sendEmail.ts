import { MailService } from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();
const sgMail = new MailService();
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

interface EmailOptions {
 to: string;
 subject: string;
 html:string;
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const { to, subject,html } = options;
  const from = "stemprobe@gmail.com";

  if (!to || !subject ) {
    throw new Error(
      "Missing required fields: to, subject, code, and fileUrl are required."
    );
  }

  if (!isValidEmail(to) || !isValidEmail(from)) {
    throw new Error("Invalid email format.");
  }


  const msg = { to, from, subject, html };

  try {
    // console.log("Sending email with payload:", msg);
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
};