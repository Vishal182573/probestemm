// routes/webinarRoutes.js
import express from 'express';
import {
  getAllWebinars,
  getWebinarsByProfessorId,
  requestWebinar,
  updateWebinarStatus,
  updateProfessorWebinarStatus,
} from '../controllers/webinarsControllers.ts';

const router = express.Router();

// Routes
router.get('/', getAllWebinars); // Get all webinars
router.get('/professor/:professorId', getWebinarsByProfessorId); // Get webinars by professor ID
router.post('/request', requestWebinar); // Professor requests webinar (pending)
router.put('/status/:webinarId', updateWebinarStatus); // Super admin updates status
router.put('/finalize/:webinarId', updateProfessorWebinarStatus); // Professor finalizes webinar

export default router;
