/**
 * Real-time Chat & Conversation Controller
 */

const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: { userId }
        }
      },
      include: {
        messages: true
      }
    });

    // Format each conversation with partner info, last message, unread count
    const enriched = conversations.map(conv => {
      const partnerParticipant = (conv.participants || []).find(p => p.userId !== userId);
      const partner = partnerParticipant ? partnerParticipant.user : null;
      const msgs = conv.messages || [];
      const lastMessage = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      const unreadCount = msgs.filter(m => m.senderId !== userId && !m.isRead).length;

      return {
        id: conv.id,
        exchangeId: conv.exchangeId,
        partner: partner ? {
          id: partner.id,
          username: partner.username,
          fullName: partner.profile?.fullName,
          avatarUrl: partner.profile?.avatarUrl,
          isMentor: partner.profile?.isMentor
        } : null,
        lastMessage,
        unreadCount,
        updatedAt: conv.updatedAt
      };
    });

    // Sort by most recently updated
    enriched.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return successResponse(res, enriched, 'Conversations retrieved');
  } catch (err) {
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const conv = await db.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conv) {
      return errorResponse(res, 'Conversation not found', 404);
    }

    const isParticipant = (conv.participants || []).some(p => p.userId === userId);
    if (!isParticipant && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized to view this conversation', 403);
    }

    // Mark messages from the other user as read
    await db.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId }
      },
      data: { isRead: true }
    });

    const messages = await db.message.findMany({
      where: { conversationId },
      include: { sender: { include: { profile: true } } },
      orderBy: { createdAt: 'asc' }
    });

    const sanitized = messages.map(m => {
      const copy = { ...m };
      if (copy.sender) {
        const { password, ...s } = copy.sender;
        copy.sender = s;
      }
      return copy;
    });

    return successResponse(res, sanitized, 'Messages retrieved');
  } catch (err) {
    next(err);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return errorResponse(res, 'Message content cannot be empty', 400);
    }

    const conv = await db.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conv) {
      return errorResponse(res, 'Conversation not found', 404);
    }

    const isParticipant = (conv.participants || []).some(p => p.userId === userId);
    if (!isParticipant && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized to post messages to this conversation', 403);
    }

    const message = await db.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: content.trim()
      },
      include: {
        sender: { include: { profile: true } }
      }
    });

    // Notify other participant
    const partner = (conv.participants || []).find(p => p.userId !== userId);
    if (partner) {
      await db.notification.create({
        data: {
          userId: partner.userId,
          type: 'NEW_MESSAGE',
          title: `New Message from ${req.user.profile?.fullName || req.user.username}`,
          message: content.trim().length > 60 ? content.trim().substring(0, 57) + '...' : content.trim(),
          link: `/dashboard/messages?conversationId=${conversationId}`
        }
      });
    }

    const copy = { ...message };
    if (copy.sender) {
      const { password, ...s } = copy.sender;
      copy.sender = s;
    }

    return successResponse(res, copy, 'Message sent', 201);
  } catch (err) {
    next(err);
  }
};

const getOrCreateDirectConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.body;

    if (!targetUserId || targetUserId === userId) {
      return errorResponse(res, 'Invalid target user', 400);
    }

    // Check if conversation already exists between these 2 users
    const userConvs = await db.conversation.findMany({
      where: {
        participants: { some: { userId } }
      }
    });

    let existing = null;
    for (const c of userConvs) {
      const hasTarget = (c.participants || []).some(p => p.userId === targetUserId);
      if (hasTarget) {
        existing = c;
        break;
      }
    }

    if (existing) {
      return successResponse(res, existing, 'Existing conversation found');
    }

    const newConv = await db.conversation.create({
      data: {
        participants: {
          create: [
            { userId },
            { userId: targetUserId }
          ]
        }
      }
    });

    return successResponse(res, newConv, 'Conversation started', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  getOrCreateDirectConversation
};
