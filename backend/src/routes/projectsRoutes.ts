// routes/projectRoutes.ts

import express from "express";
import * as projectController from "../controllers/projectsController";

const router = express.Router();

// Professor project creation routes
router.post(
  "/professor-collaboration",
  projectController.createProfessorProject
);
router.post("/student-opportunity", projectController.createStudentProject);
router.post("/industry-collaboration", projectController.createIndustryProject);

// Business project creation routes
router.post("/rd-project", projectController.createRDProject);
router.post("/internship", projectController.createInternshipProject);

// Student proposal route
router.post("/student-proposal", projectController.createStudentProposal);

// Get projects routes
router.get("/", projectController.getProjectsByType);
router.get(
  "/:projectId/applications",
  projectController.getProjectApplications
);

// Apply for project route
router.post('/:projectId/apply', projectController.applyForProject);

//status routes for projects

router.post("/:projectId/assign", projectController.assignParticipant);
router.post("/:projectId/reject", projectController.rejectApplication);
router.post("/:projectId/review", projectController.setApplicationInReview);

router.post("/:projectId/complete", projectController.completeProject);
router.get(
  "/:userType/:userId/projects",
  projectController.getProjectsByUserId
);

// enrolled projects routes

router.get(
  "/enrolled/professor/:professorId",
  projectController.getEnrolledProjectsForProfessor
);

// Get enrolled projects for a student
router.get(
  "/enrolled/student/:studentId",
  projectController.getEnrolledProjectsForStudent
);

// Get enrolled projects for a business
router.get(
  "/enrolled/business/:businessId",
  projectController.getEnrolledProjectsForBusiness
);

// Get last 3 recent project
router.get("/recent", projectController.getRecentProjects);

router.delete("/:projectId/delete", projectController.deleteProject);

router.get('/applied/:userId', projectController.getAppliedProjects);

export default router;
