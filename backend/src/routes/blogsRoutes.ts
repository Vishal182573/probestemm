import { Router } from 'express';
import blogController from '../controllers/blogsControllers.ts';

const router = Router();

// Blog routes
router.get('/blogs', blogController.getBlogs);
router.get('/blogs/:id', blogController.getBlogById);
router.post('/blogs', blogController.createBlog);
router.post('/blogs/:id/like', blogController.likeBlog);
router.post('/blogs/:id/dislike', blogController.dislikeBlog);

// Comment routes
router.post('/blogs/:blogId/comments', blogController.createComment);

export default router;