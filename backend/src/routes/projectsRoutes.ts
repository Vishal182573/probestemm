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
router.post('/business', createBusinessProject); // create business projects
router.get('/business', getAllBusinessProjects); // get all business projects 
router.patch('/business/:id/status', changeBusinessProjectStatus); // change status of project used while business select proffesors from list and also when project is completed from professor side
router.get('/business/:businessId/projects', getProjectsByBusinessId); // get all business projects to show on business profile 
router.post('/business/apply', applyToBusinessProject);  // route for professors to apply on projects posted by business
router.get('/business/:projectId/applicants', getAppliedProfessors); // route for list of all professors that applied for the project

// Professor project routes   .. ..............// same functions as above 
router.post('/professor', createProfessorProject);
router.get('/professor', getAllProfessorProjects);
router.patch('/professor/:id/status', changeProfessorProjectStatus);
router.get('/professor/:professorId/projects', getProjectsByProfessorId);
router.post('/professor/apply', applyToProfessorProject);
router.get('/professor/:projectId/applicants', getAppliedStudents); 

export default router;