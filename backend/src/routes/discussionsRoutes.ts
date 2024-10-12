// src/routes/discussionRoutes.ts

import express from 'express';
import {
  createDiscussion,
  answerDiscussion,
  voteDiscussion,
  searchDiscussions,
  getRecentDiscussions,
  getMostVotedDiscussions,
  getDiscussionsByStatus,
  getDiscussionsByCategoryAndSubcategory,
} from '../controllers/discussionsControllers.ts';

const router = express.Router();

router.post('/create', createDiscussion);
router.post('/answer', answerDiscussion);
router.post('/vote', voteDiscussion);
router.get('/search', searchDiscussions);
router.get('/recent', getRecentDiscussions);
router.get('/most-voted', getMostVotedDiscussions);
router.get('/by-status', getDiscussionsByStatus);
router.get('/by-category-subcategory', getDiscussionsByCategoryAndSubcategory);

export default router;