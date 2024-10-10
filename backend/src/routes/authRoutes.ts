import express from "express";
import {
  studentSignup,
  professorSignup,
  businessSignup,
  adminSignup,
  signin,
} from "../controllers/authController";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/student/signup", upload.single("profileImage"), studentSignup);
router.post(
  "/professor/signup",
  upload.single("profileImage"),
  professorSignup
);
router.post("/business/signup", businessSignup);
router.post("/admin/signup", adminSignup);
router.post("/signin", signin);

export default router;
