import express from "express";
import blogController from "../controllers/blogsControllers";
import { authMiddleware } from "../middleware/authMiddleware";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    public_id: (req, file) => `profile_images/${file.originalname}`,
    // folder: "profile_images",
  },
});

const router = express.Router();
const upload = multer({ storage: storage });

// Public routes
router.get("/blogs", async (req, res) => {
  try {
    await blogController.getBlogs(req, res);
  } catch (error) {
    console.error("Error in getting blogs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blogs/:id", async (req, res) => {
  try {
    await blogController.getBlogById(req, res);
  } catch (error) {
    console.error("Error in getting blog by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected routes
router.post(
  "/blogs",
  upload.single("blogImage"),
  authMiddleware,
  async (req, res) => {
    try {
      await blogController.createBlog(req, res);
    } catch (error) {
      console.error("Error in creating blog:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put("/blogs/:id", async (req, res) => {
  try {
    await blogController.updateBlog(req, res);
  } catch (error) {
    console.error("Error in updating blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/blogs/:id", async (req, res) => {
  try {
    await blogController.deleteBlog(req, res);
  } catch (error) {
    console.error("Error in deleting blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blogs/:blogId/comments", authMiddleware, async (req, res) => {
  try {
    await blogController.createComment(req, res);
  } catch (error) {
    console.error("Error in creating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Comment management (only for the comment creator or the blog author)
router.put(
  "/blogs/:blogId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      await blogController.updateComment(req, res);
    } catch (error) {
      console.error("Error in updating comment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete(
  "/blogs/:blogId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      await blogController.deleteComment(req, res);
    } catch (error) {
      console.error("Error in deleting comment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/blogs/:blogId/user-interactions",
  authMiddleware,
  async (req, res) => {
    try {
      await blogController.userInteraction(req, res);
    } catch (error) {
      console.error("Error in getting user interactions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/blogs/:id/toggle-like", authMiddleware, async (req, res) => {
  try {
    await blogController.toggleBlogLike(req, res);
  } catch (error) {
    console.error("Error in toggling blog like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
