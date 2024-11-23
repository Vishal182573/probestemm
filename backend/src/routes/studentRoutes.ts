import express from "express";
import {
  getStudentById,
  createStudent,
  updateStudent,
  searchStudents,
} from "../controllers/studentControllers";
const router = express.Router();

// Route setup
router.get("/search", searchStudents);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudent);

export default router;
