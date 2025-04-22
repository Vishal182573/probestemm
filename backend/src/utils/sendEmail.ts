import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'probestem2024@gmail.com',
    pass: process.env.EMAIL_PASSWORD || '',
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const { to, subject, html } = options;
  const from = "probestem2024@gmail.com";

  if (!to || !subject) {
    throw new Error(
      "Missing required fields: to and subject are required."
    );
  }

  if (!isValidEmail(to) || !isValidEmail(from)) {
    throw new Error("Invalid email format.");
  }

  const mailOptions = {
    from: {
      name: 'Probestem', // Add a display name
      address: from
    },
    to,
    subject,
    html,
    headers: {
      'X-Mailer': 'Probestem',
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high',
      'List-Unsubscribe': '<mailto:unsubscribe@probestem.com>',
    },
    dkim: {
      domainName: "probestem.com",
      keySelector: "default",
      privateKey: process.env.DKIM_PRIVATE_KEY || "",
    }
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
};