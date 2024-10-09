import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import studentsRoutes from "./routes/studentRoutes.ts"
import ProfessorRoutes from "./routes/professorRoutes.ts"
import DiscussionRoutes from "./routes/discussionsRoutes.ts"
import BlogsRoutes from "./routes/blogsRoutes.ts"
import WebinarRoutes from "./routes/webinarRoutes.ts"
import ProjectRoutes from "./routes/projectsRoutes.ts"
import BusinessRoutes from "./routes/businessRoutes.ts"
import SuperAdminRoutes from "./routes/superadminRoutes.ts"

import ImageUploadRoutes from "./routes/uploadImageRoutes.ts"

import { FRONTEND_URL } from "./constants";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : `${FRONTEND_URL}`,
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.use("api/student",studentsRoutes)
app.use("api/professor",ProfessorRoutes)
app.use("api/discussion",DiscussionRoutes)
app.use("api/blog",BlogsRoutes)
app.use("api/project",ProjectRoutes)
app.use("api/webinar",WebinarRoutes)
app.use("api/business",BusinessRoutes)
app.use("api/super-admin",SuperAdminRoutes)
app.use("api/image",ImageUploadRoutes)

app.use(express.json());

app.use("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
