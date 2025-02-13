import type { Request, Response } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
const prisma = new PrismaClient();

export const createOrGetChatRoom = async (req: Request, res: Response) => {
  try {
    const { userOneId, userOneType, userTwoId, userTwoType } = req.body;

    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        OR: [
          { userOneId, userTwoId },
          { userOneId: userTwoId, userTwoId: userOneId }
        ]
      }
    });

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          userOneId,
          userOneType,
          userTwoId,
          userTwoType
        }
      });
    }

    res.json(chatRoom);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create/get chat room' });
  }
};

// export const sendMessage = async (req: Request, res: Response) => {
//   try {
//     const { chatRoomId, content, senderId, senderType, mediaUrls, mediaType } = req.body;

//     const message = await prisma.message.create({
//       data: {
//         chatRoomId,
//         content,
//         senderId,
//         senderType,
//         mediaUrls,
//         mediaType
//       }
//     });

//     res.json(message);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to send message' });
//   }
// };
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { chatRoomId, content, senderId, senderType, mediaUrls, mediaType } = req.body;

    // First get the chat room to identify both users
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId }
    });

    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }

    // Check if either user has blocked the other
    const blockExists = await prisma.userBlock.findFirst({
      where: {
        OR: [
          {
            blockerUserId: chatRoom.userOneId,
            blockedUserId: chatRoom.userTwoId
          },
          {
            blockerUserId: chatRoom.userTwoId,
            blockedUserId: chatRoom.userOneId
          }
        ]
      }
    });

    if (blockExists) {
      return res.status(403).json({ error: 'Cannot send message: one of the users has blocked the other' });
    }

    // If no blocks exist, proceed with creating the message
    const message = await prisma.message.create({
      data: {
        chatRoomId,
        content,
        senderId,
        senderType,
        mediaUrls,
        mediaType
      }
    });

    res.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { chatId, page = 1, limit = 50 } = req.query;

    if (!chatId) {
      return res.status(400).json({ error: 'chatId is required' });
    }

    // Find the chat room by its ID
    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        id: String(chatId), // Ensure chatId is cast to string
      },
    });
    
    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }
    
    // Fetch messages related to the chat room
    const messages = await prisma.message.findMany({
      where: {
        chatRoomId: chatRoom.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    // Respond with the messages
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};


export const getUserChats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        OR: [
          { userOneId: userId },
          { userTwoId: userId }
        ]
      },
      select: {
        id: true,
        userOneId: true,
        userOneType: true,
        userTwoId: true,
        userTwoType: true,
        updatedAt: true,
        messages: {
          where: {
            isRead: false,
            NOT: {
              senderId: userId // Exclude messages sent by the requesting user
            }
          },
          select: {
            id: true
          }
        }
      }
    });

    // Fetch user details for each chat
    const chatsWithUserInfo = await Promise.all(
      chatRooms.map(async (chat) => {
        const otherUserId = chat.userOneId === userId ? chat.userTwoId : chat.userOneId;
        const otherUserType = chat.userOneId === userId ? chat.userTwoType : chat.userOneType;
        let otherUser;

        switch (otherUserType) {
          case 'student':
            otherUser = await prisma.student.findUnique({ where: { id: otherUserId } });
            break;
          case 'professor':
            otherUser = await prisma.professor.findUnique({ where: { id: otherUserId } });
            break;
          case 'business':
            otherUser = await prisma.business.findUnique({ where: { id: otherUserId } });
            break;
        }

        return {
          ...chat,
          unreadCount: chat.messages.length, // Count of unread messages
          otherUser,
          // messages: undefined // Remove messages array from response
        };
      })
    );

    res.json(chatsWithUserInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user chats' });
  }
};

export const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const { chatRoomId, userId } = req.body;

    // First check if the chat room exists
    const chatRoom = await prisma.chatRoom.findUnique({
      where: {
        id: chatRoomId
      }
    });

    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }

    // Verify that the user is a participant in the chat room
    if (chatRoom.userOneId !== userId && chatRoom.userTwoId !== userId) {
      return res.status(403).json({ error: 'User is not a participant in this chat room' });
    }

    // Update all unread messages sent by the other user
    await prisma.message.updateMany({
      where: {
        chatRoomId: chatRoomId,
        NOT: {
          senderId: userId
        },
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};

export const getUnreadMessageCount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const unreadCount = await prisma.message.count({
      where: {
        chatRoom: {
          OR: [
            { userOneId: userId },
            { userTwoId: userId }
          ]
        },
        NOT: {
          senderId: userId
        },
        isRead: false
      }
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get unread message count' });
  }
};

export const deleteChatRoom = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;

    // Check if the chat room exists
    const chatRoom = await prisma.chatRoom.findUnique({
      where: {
        id: chatId
      }
    });

    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }

    // Delete all messages in the chat room first
    await prisma.message.deleteMany({
      where: {
        chatRoomId: chatId
      }
    });

    // Delete the chat room
    await prisma.chatRoom.delete({
      where: {
        id: chatId
      }
    });

    res.json({ success: true, message: 'Chat room and messages deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat room:', error);
    res.status(500).json({ error: 'Failed to delete chat room' });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { blockerId } = req.body;

    // Check if the block already exists
    const existingBlock = await prisma.userBlock.findFirst({
      where: {
        blockedUserId: userId,
        blockerUserId: blockerId,
      },
    });

    if (existingBlock) {
      return res.status(400).json({ error: 'User is already blocked' });
    }

    // Create new block record
    const block = await prisma.userBlock.create({
      data: {
        blockedUserId: userId,
        blockerUserId: blockerId,
      },
    });

    res.json({ success: true, block });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ error: 'Failed to block user' });
  }
};

export const unblockUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { blockerId } = req.body;

    // Delete the block record
    await prisma.userBlock.deleteMany({
      where: {
        blockedUserId: userId,
        blockerUserId: blockerId,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ error: 'Failed to unblock user' });
  }
};

export const getBlockedUsers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const blocks = await prisma.userBlock.findMany({
      where: {
        blockerUserId: userId,
      },
      select: {
        blockedUserId: true,
      },
    });

    const blockedUsers = blocks.map(block => block.blockedUserId);
    res.json({ blockedUsers });
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    res.status(500).json({ error: 'Failed to get blocked users' });
  }
};