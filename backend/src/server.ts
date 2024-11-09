import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { FRONTEND_URL } from "./constants";
import authRoutes from "./routes/authRoutes";
import studentsRoutes from "./routes/studentRoutes";
import professorRoutes from "./routes/professorRoutes";
import discussionRoutes from "./routes/discussionsRoutes";
import blogsRoutes from "./routes/blogsRoutes";
import webinarRoutes from "./routes/webinarRoutes";
import projectRoutes from "./routes/projectsRoutes";
import businessRoutes from "./routes/businessRoutes";
import superAdminRoutes from "./routes/superadminRoutes";
import imageUploadRoutes from "./routes/uploadImageRoutes";
import contactRoutes from "./routes/contactRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import faqRoutes from "./routes/faqRoutes";
import userRoutes from "./routes/userRoutes";
import patentRoutes from "./routes/patentRoutes";
import emailRoutes from "./routes/emailRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/professors", professorRoutes);
app.use("/api/discussion", discussionRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/webinars", webinarRoutes);
app.use("/api/businesss", businessRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/image", imageUploadRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/user", userRoutes);
app.use("/api/patents", patentRoutes);
app.use("/api/email", emailRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
