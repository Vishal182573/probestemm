// routes/faqRoutes.ts

import express from 'express';
import {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ
} from '../controllers/faqController.ts';

const router = express.Router();

// Public routes
router.get('/', getAllFAQs);
router.get('/:id', getFAQById);

// Protected routes (require authentication)
router.post('/',  createFAQ);
router.put('/:id',updateFAQ);
router.delete('/:id', deleteFAQ);

export default router;