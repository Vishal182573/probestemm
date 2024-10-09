// src/routes/businessRoutes.ts
import express from 'express';
import {
  createBusiness,
  getBusiness,
  createProject,
  answerDiscussion,
  getBusinessProjects
} from '../controllers/businessControllers';

const router = express.Router();

// Business CRUD routes
router.post('/', createBusiness);
router.get('/:id', getBusiness);

// Project management routes
router.post('/:businessId/projects', createProject);
router.get('/:businessId/projects', getBusinessProjects);

// Discussion participation routes
router.post('/:businessId/discussions/:discussionId/answer', answerDiscussion);

export default router;