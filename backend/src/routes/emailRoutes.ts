import { Router } from 'express';
import { sendVerificationEmail, validateCode } from '../controllers/emailController';

const router = Router();

// Route to send verification email
router.post('/send-email', sendVerificationEmail);

// Route to validate the code
router.post('/validate-code', validateCode);

export default router;
