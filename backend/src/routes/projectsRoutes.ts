// src/routes/projectRoutes.ts
import express from 'express';
import {
  createProfessorProject,
  createBusinessProject,
  getAllProfessorProjects,
  getAllBusinessProjects,
  getProfessorProjects,
  getBusinessProjects,
  getProjectById
} from '../controllers/projectsController.ts';

const router = express.Router();

// Project creation routes
router.post('/professor/:professorId', createProfessorProject);
router.post('/business/:businessId', createBusinessProject);

// Get all projects routes
router.get('/professors', getAllProfessorProjects);
router.get('/businesses', getAllBusinessProjects);

// Get projects by specific creator
router.get('/professor/:professorId', getProfessorProjects);
router.get('/business/:businessId', getBusinessProjects);

// Get single project
router.get('/:id', getProjectById);

export default router;