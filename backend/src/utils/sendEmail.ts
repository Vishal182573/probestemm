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
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProbeSTEM File Retrieval</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f4f4f4;
      }
      .container {
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        padding: 30px;
        text-align: center;
      }
      .logo {
        color: #2c3e50;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .logo img {
        height: 40px;
        margin-right: 10px;
      }
      .code-container {
        background-color: #f0f4f8;
        border: 2px solid #3498db;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 2px;
        color: #2c3e50;
      }
      .instructions {
        color: #34495e;
        font-size: 14px;
        margin-top: 20px;
      }
      .footer {
        margin-top: 20px;
        font-size: 12px;
        color: #7f8c8d;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        ProbeSTEM
      </div>
      
      <p>Your otp is ready for retrieval.</p>
      
      <div class="code-container">
        ${code}
      </div>
      
      <div class="instructions">
        <p>Enter this code on our platform.</p>
        <p><strong>Note:</strong> This code will expire after one minute.</p>
      </div>
      
      <div class="footer">
        © ${new Date().getFullYear()} ProbeSTEM. All rights reserved.
      </div>
    </div>
  </body>
  </html>
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