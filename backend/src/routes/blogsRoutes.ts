import express from "express";
import blogController from "../controllers/blogsControllers";
import {
  authMiddleware,
  professorAuthMiddleware,
} from "../middleware/authMiddleware";

const router = express.Router();

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
router.post("/blogs", professorAuthMiddleware, async (req, res) => {
  try {
    await blogController.createBlog(req, res);
  } catch (error) {
    console.error("Error in creating blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/blogs/:id", professorAuthMiddleware, async (req, res) => {
  try {
    await blogController.updateBlog(req, res);
  } catch (error) {
    console.error("Error in updating blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/blogs/:id", professorAuthMiddleware, async (req, res) => {
  try {
    await blogController.deleteBlog(req, res);
  } catch (error) {
    console.error("Error in deleting blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Interaction routes (require any authenticated user)
router.post("/blogs/:id/like", authMiddleware, async (req, res) => {
  try {
    await blogController.likeBlog(req, res);
  } catch (error) {
    console.error("Error in liking blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blogs/:id/dislike", authMiddleware, async (req, res) => {
  try {
    await blogController.dislikeBlog(req, res);
  } catch (error) {
    console.error("Error in disliking blog:", error);
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

export default router;
