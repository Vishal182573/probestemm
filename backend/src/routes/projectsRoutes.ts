import express from 'express';
import {
  createBusinessProject,
  createProfessorProject,
  getAllBusinessProjects,
  getAllProfessorProjects,
  changeBusinessProjectStatus,
  changeProfessorProjectStatus,
  getProjectsByBusinessId,
  getProjectsByProfessorId,
  applyToBusinessProject,
  applyToProfessorProject,
  getAppliedProfessors,
  getAppliedStudents,
} from '../controllers/projectsController.ts';

const router = express.Router();

// Business project routes
router.post('/business', createBusinessProject);
router.get('/business', getAllBusinessProjects);
router.patch('/business/:id/status', changeBusinessProjectStatus);
router.get('/business/:businessId/projects', getProjectsByBusinessId);
router.post('/business/apply', applyToBusinessProject);
router.get('/business/:projectId/applicants', getAppliedProfessors);

// Professor project routes
router.post('/professor', createProfessorProject);
router.get('/professor', getAllProfessorProjects);
router.patch('/professor/:id/status', changeProfessorProjectStatus);
router.get('/professor/:professorId/projects', getProjectsByProfessorId);
router.post('/professor/apply', applyToProfessorProject);
router.get('/professor/:projectId/applicants', getAppliedStudents);

export default router;