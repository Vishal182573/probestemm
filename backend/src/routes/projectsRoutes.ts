import express from "express";
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
} from "../controllers/projectsController";
import {
  businessAuthMiddleware,
  professorAuthMiddleware,
  studentAuthMiddleware,
} from "../middleware/authMiddleware";

const router = express.Router();

// Business project routes
router.post("/business", businessAuthMiddleware, async (req, res) => {
  try {
    await createBusinessProject(req, res);
  } catch (error) {
    console.error("Error in creating business project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/business", async (req, res) => {
  try {
    await getAllBusinessProjects(req, res);
  } catch (error) {
    console.error("Error in getting business projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch(
  "/business/:id/status",

  async (req, res) => {
    try {
      await changeBusinessProjectStatus(req, res);
    } catch (error) {
      console.error("Error in changing business project status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/business/:businessId/projects",
  businessAuthMiddleware,
  async (req, res) => {
    try {
      await getProjectsByBusinessId(req, res);
    } catch (error) {
      console.error("Error in getting projects by business ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/business/apply", professorAuthMiddleware, async (req, res) => {
  try {
    await applyToBusinessProject(req, res);
  } catch (error) {
    console.error("Error in applying to business project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/business/:projectId/applicants",

  async (req, res) => {
    try {
      await getAppliedProfessors(req, res);
    } catch (error) {
      console.error("Error in getting applied professors:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Professor project routes
router.post("/professor", professorAuthMiddleware, async (req, res) => {
  try {
    await createProfessorProject(req, res);
  } catch (error) {
    console.error("Error in creating professor project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/professor", async (req, res) => {
  try {
    await getAllProfessorProjects(req, res);
  } catch (error) {
    console.error("Error in getting professor projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch(
  "/professor/:id/status",

  async (req, res) => {
    try {
      await changeProfessorProjectStatus(req, res);
    } catch (error) {
      console.error("Error in changing professor project status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/professor/:professorId/projects",
  professorAuthMiddleware,
  async (req, res) => {
    try {
      await getProjectsByProfessorId(req, res);
    } catch (error) {
      console.error("Error in getting projects by professor ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/professor/apply", studentAuthMiddleware, async (req, res) => {
  try {
    await applyToProfessorProject(req, res);
  } catch (error) {
    console.error("Error in applying to professor project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/professor/:projectId/applicants",

  async (req, res) => {
    try {
      await getAppliedStudents(req, res);
    } catch (error) {
      console.error("Error in getting applied students:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
