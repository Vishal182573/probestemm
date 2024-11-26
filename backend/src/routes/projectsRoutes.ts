// routes/projectRoutes.ts

import express from "express";
import multer from "multer";
import * as projectController from "../controllers/projectsController";

const router = express.Router();

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
router.post(
  "/:projectId/apply",
  upload.array("images", 5),
  projectController.applyForProject
);
//status routes for projects

router.post("/:projectId/assign", projectController.assignParticipant);
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
export default router;
