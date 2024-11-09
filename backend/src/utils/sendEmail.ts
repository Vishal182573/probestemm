import { MailService } from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

const sgMail = new MailService();
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

interface EmailOptions {
  to: string;
  subject: string;
  code: string;
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const { to, subject, code } = options;
  const from = "sharmavs9205@gmail.com";

  if (!to || !subject || !code) {
    throw new Error(
      "Missing required fields: to, subject, code, and fileUrl are required."
    );
  }

  if (!isValidEmail(to) || !isValidEmail(from)) {
    throw new Error("Invalid email format.");
  }

  const html = `
    <h1>Your File is Ready for Download</h1>
    <p>A file has been shared with you. Use the following code to access it:</p>
    <h2>${code}</h2>
    <p>Visit our file retrieval page and enter this code to download your file.</p>
    <p>Note: This link will expire after download.</p>
  `;

  const msg = { to, from, subject, html };

  try {
    console.log("Sending email with payload:", msg);
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
};
