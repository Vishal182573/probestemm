// src/routes/chat.routes.ts
import express from 'express';
import {
  createOrGetChatRoom,
  sendMessage,
  getChatMessages,
  markMessagesAsRead,
  getUnreadMessageCount,
  getUserChats
} from '../controllers/chatController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Chat routes
router.post('/rooms', createOrGetChatRoom);
router.post('/messages', sendMessage);
router.get('/messages', getChatMessages);
router.get('/rooms/:userId', getUserChats);
router.post('/messages/read', markMessagesAsRead);
router.get('/messages/unread/:userId', getUnreadMessageCount);

export default router;