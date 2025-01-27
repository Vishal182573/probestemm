import { Router } from 'express';
import { scheduleWeeklyEmails, sendVerificationEmail, sendWelcomeEmail, validateCode } from '../controllers/emailController';

scheduleWeeklyEmails();

const router = Router();

// Route to signup email
router.post('/signup-email', sendWelcomeEmail);

// Route to send verification email
router.post('/send-email', sendVerificationEmail);

// Route to validate the code
router.post('/validate-code', validateCode);

export default router;
