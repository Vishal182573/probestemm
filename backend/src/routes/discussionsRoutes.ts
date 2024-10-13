// src/routes/discussionRoutes.ts

import express from "express";
import {
  createDiscussion,
  answerDiscussion,
  voteDiscussion,
  searchDiscussions,
  getDiscussionById,
} from "../controllers/discussionsControllers.ts";

const router = express.Router();

router.post("/create", createDiscussion);
router.post("/answer", async (req, res) => {
  try {
    await answerDiscussion(req, res);
  } catch (error) {
    console.error("Error in answering discussion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/vote", async (req, res) => {
  try {
    await voteDiscussion(req, res);
  } catch (error) {
    console.error("Error in voting discussion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/search", async (req, res) => {
  try {
    await searchDiscussions(req, res);
  } catch (error) {
    console.error("Error in searching discussions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    await getDiscussionById(req, res);
  } catch (error) {
    console.error("Error in getting discussion by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
