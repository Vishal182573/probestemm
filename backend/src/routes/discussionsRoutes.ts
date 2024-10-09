import express from "express";
import {
    getDiscussionById,
    getDiscussions,
    createAnswer,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion
} from "../controllers/discussionsControllers";

const router = express.Router();

router.get('/', getDiscussions);
router.get('/:id', getDiscussionById);
router.post('/', createDiscussion);
router.post('/:id/answers', createAnswer);
// router.put('/:id', updateDiscussion);

export default router;