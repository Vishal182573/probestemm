import express from 'express';
import { postContact, getAllContacts } from '../controllers/contactControllers.ts';

const router = express.Router();

router.post('/', postContact);
router.get('/', getAllContacts);

export default router;