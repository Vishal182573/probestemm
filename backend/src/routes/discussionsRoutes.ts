// src/routes/discussionRoutes.ts

import express from 'express';
import {
  createDiscussion,
  answerDiscussion,
  voteDiscussion,
  searchDiscussions,
  getDiscussionById
} from '../controllers/discussionsControllers.ts';

const router = express.Router();

router.post('/create', createDiscussion);
router.post('/answer', answerDiscussion);
router.post('/vote', voteDiscussion);
router.get('/search', searchDiscussions);
router.get('/:id', getDiscussionById);

export default router;