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

// Create a transporter using Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER || 'admin@probestem.com',
    pass: process.env.EMAIL_PASSWORD || '',
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const { to, subject, html } = options;
  const from = "admin@probestem.com";

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
      name: 'Probestem',
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