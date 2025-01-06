import type{ Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../utils/sendEmail.ts';
import generateCode from '../utils/otp.ts';
import cron from 'node-cron';

const prisma = new PrismaClient();

// Send email with code
export const sendVerificationEmail = async (req: Request, res: Response) => {
try {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Check if email already exists in the database
  const existingEntry = await prisma.emailVerification.findUnique({ where: { email } });
  if (existingEntry) {
    await prisma.emailVerification.delete({ where: { email } });
  }

  const code = generateCode();
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
  await sendEmail({
    to: email,
    subject: 'Your Verification Code',
    html
  });

  // Create a new entry in the database with automatic deletion
  await prisma.emailVerification.create({
    data: {
      email,
      code,
      expiresAt: new Date(Date.now() + 60000), // 30 seconds from now
    },
  });

  res.status(200).json({ message: 'Verification email sent successfully' });
} catch (error) {
  console.error('Error sending verification email:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}
};

// Validate the code
export const validateCode = async (req: Request, res: Response) => {
try {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' });
  }

  const entry = await prisma.emailVerification.findUnique({ 
    where: { 
      email,
      expiresAt: { gt: new Date() } // Check if not expired
    } 
  });

  if (entry && entry.code === code) {
    await prisma.emailVerification.delete({ where: { email } });
    return res.status(200).json({ message: 'Code verified successfully' });
  } else {
    if (entry) {
      await prisma.emailVerification.delete({ where: { email } });
    }
    return res.status(400).json({ error: 'Invalid code or email' });
  }
} catch (error) {
  console.error('Error validating code:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}
};

// Optional: Add a cleanup job to remove expired entries
export const cleanupExpiredVerifications = async () => {
  try {
    await prisma.emailVerification.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    });
  } catch (error) {
    console.error('Error cleaning up expired verifications:', error);
  }
};

export const sendWelcomeEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Probe STEM</title>
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
        }
        .logo {
          color: #2c3e50;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }
        .content {
          color: #34495e;
          font-size: 14px;
        }
        .highlight {
          font-weight: bold;
          color: #2c3e50;
        }
        .mission {
          font-style: italic;
          margin: 20px 0;
          color: #34495e;
        }
        .next-steps {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #7f8c8d;
          text-align: center;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          Probe STEM
        </div>
        
        <div class="content">
          <p>Dear User,</p>
          
          <p>We're thrilled to welcome you to <span class="highlight">Probe STEM</span>, where innovation meets collaboration! By joining our platform, you're becoming a vital part of a global network dedicated to bridging the gap between academia and industry, driving the next wave of innovation in STEM.</p>
          
          <p>At Probe STEM, you'll find:</p>
          <ul>
            <li><strong>Collaborative Opportunities:</strong> Partner with students, educators, and industry experts from around the world.</li>
            <li><strong>Inspiring Community:</strong> Connect with like-minded individuals passionate about transforming ideas into impactful solutions.</li>
          </ul>
          
          <div class="mission">
            <p>Our mission is simple but profound: <strong>Connecting global thinkers to inspire impactful collaborations.</strong> Together, we'll redefine the boundaries of what's possible in science and technology.</p>
          </div>
          
          <div class="next-steps">
            <p><strong>What's Next?</strong></p>
            <ol>
              <li>Log in to your account and explore the features.</li>
              <li>Start connecting with peers and mentors.</li>
              <li>Share your research ideas and collaborate on exciting projects.</li>
            </ol>
          </div>
          
          <p>If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:probestem2024@gmail.com">probestem2024@gmail.com</a></p>
          
          <p>Let's make groundbreaking discoveries together!</p>
          
          <p>Warm regards,<br>
          The Probe STEM Team</p>
        </div>
        
        <div class="footer">
          Empowering Innovators, bridging worlds.
        </div>
      </div>
    </body>
    </html>
    `;

    await sendEmail({
      to: email,
      subject: 'Welcome to Probe STEM – Empowering Global Innovators!',
      html
    });

    res.status(200).json({ message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const generateDailyEmailHTML = (userType: 'STUDENT' | 'PROFESSOR' | 'BUSINESS', userName: string = '') => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A Gentle Reminder from Probe STEM ⭐</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #ffffff;
        background-color: #1a1f24;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .container {
        padding: 20px;
      }
      .content {
        font-size: 14px;
      }
      .link {
        color: #3498db;
        text-decoration: none;
      }
      p {
        margin: 10px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">
        <p>Dear user,</p>
        
        <p>We noticed you might have missed some exciting updates and activities on Probe STEM! 🌐✨</p>
        
        <p>Don't miss out on connecting with global thinkers, exploring new opportunities, and making impactful collaborations. Log in now at <a href="https://probestem.com" class="link">probestem.com</a> to catch up on all the latest.</p>
        
        <p>Together, let's drive innovation forward! 🚀</p>
        
        <p>Warm regards,<br>
        The Probe STEM Team</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

export const sendDailyReminderEmails = async () => {
  try {
    // Fetch all users from different tables
    const [students, professors, businesses] = await Promise.all([
      prisma.student.findMany({
        select: {
          id: true,
          email: true,
          fullName: true
        }
      }),
      prisma.professor.findMany({
        where: {
          isApproved: true // Only send to approved professors
        },
        select: {
          id: true,
          email: true,
          fullName: true
        }
      }),
      prisma.business.findMany({
        select: {
          id: true,
          email: true,
          companyName: true
        }
      })
    ]);

    // Send emails to students
    const studentEmails = students.map(student =>
      sendEmail({
        to: student.email,
        subject: 'A Gentle Reminder from Probe STEM 🌟',
        html: generateDailyEmailHTML('STUDENT', student.fullName)
      })
    );

    // Send emails to professors
    const professorEmails = professors.map(professor =>
      sendEmail({
        to: professor.email,
        subject: 'A Gentle Reminder from Probe STEM 🌟',
        html: generateDailyEmailHTML('PROFESSOR', professor.fullName)
      })
    );

    // Send emails to businesses
    const businessEmails = businesses.map(business =>
      sendEmail({
        to: business.email,
        subject: 'A Gentle Reminder from Probe STEM 🌟',
        html: generateDailyEmailHTML('BUSINESS', business.companyName)
      })
    );

    // Send all emails concurrently
    await Promise.all([
      ...studentEmails,
      ...professorEmails,
      ...businessEmails
    ]);

    const totalEmails = students.length + professors.length + businesses.length;
    console.log(`Successfully sent ${totalEmails} daily reminder emails`);
    
    return {
      success: true,
      emailsSent: {
        total: totalEmails,
        students: students.length,
        professors: professors.length,
        businesses: businesses.length
      }
    };

  } catch (error) {
    console.error('Error sending daily reminder emails:', error);
    throw error;
  }
};

// Schedule the daily email job to run at 4:00 PM (16:00)
export const scheduleDailyEmails = () => {
  cron.schedule('0 18 * * *', async () => {
    try {
      await sendDailyReminderEmails();
    } catch (error) {
      console.error('Failed to send daily emails:', error);
    }
  });
};