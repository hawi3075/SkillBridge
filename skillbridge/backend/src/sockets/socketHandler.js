/**
 * Socket.IO Real-time Messaging and Presence Handler
 */

const { verifyToken } = require('../utils/jwt');
const db = require('../config/db');

// Map of active user sockets: userId -> Set of socketIds
const onlineUsers = new Map();

function initSocketServer(io) {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) {
        return next(new Error('Authentication token required'));
      }
      const decoded = verifyToken(token);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Socket authentication error: ' + err.message));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?.userId || socket.user?.id;
    if (!userId) {
      socket.disconnect();
      return;
    }

    // Register user presence
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Join personal user notification room
    socket.join(`user:${userId}`);

    // Broadcast online status to all connected clients
    io.emit('user_status_change', {
      userId,
      isOnline: true,
      onlineUserIds: Array.from(onlineUsers.keys())
    });

    // 1. Join Conversation Room
    socket.on('join_conversation', async ({ conversationId }) => {
      if (!conversationId) return;
      socket.join(`conversation:${conversationId}`);
    });

    // 2. Leave Conversation Room
    socket.on('leave_conversation', ({ conversationId }) => {
      if (!conversationId) return;
      socket.leave(`conversation:${conversationId}`);
    });

    // 3. Send Message
    socket.on('send_message', async ({ conversationId, content }) => {
      try {
        if (!conversationId || !content || !content.trim()) return;

        // Verify conversation membership
        const conv = await db.conversation.findUnique({ where: { id: conversationId } });
        if (!conv) return;

        const isMember = (conv.participants || []).some(p => p.userId === userId);
        if (!isMember) return;

        // Persist message
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

        const { password, ...safeSender } = message.sender || {};
        const messagePayload = {
          ...message,
          sender: safeSender
        };

        // Broadcast to conversation room
        io.to(`conversation:${conversationId}`).emit('new_message', messagePayload);

        // Notify partner individually
        const partner = (conv.participants || []).find(p => p.userId !== userId);
        if (partner) {
          io.to(`user:${partner.userId}`).emit('notification', {
            type: 'NEW_MESSAGE',
            title: `New message`,
            message: content.trim().substring(0, 50),
            conversationId
          });
        }
      } catch (err) {
        console.error('Socket send_message error:', err);
      }
    });

    // 4. Typing Indicators
    socket.on('typing_start', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        conversationId,
        userId,
        isTyping: true
      });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        conversationId,
        userId,
        isTyping: false
      });
    });

    // 5. Read Receipt
    socket.on('mark_read', async ({ conversationId }) => {
      try {
        await db.message.updateMany({
          where: { conversationId, senderId: { not: userId } },
          data: { isRead: true }
        });
        socket.to(`conversation:${conversationId}`).emit('messages_read', {
          conversationId,
          readBy: userId
        });
      } catch (err) {
        console.error('Socket mark_read error:', err);
      }
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          io.emit('user_status_change', {
            userId,
            isOnline: false,
            onlineUserIds: Array.from(onlineUsers.keys())
          });
        }
      }
    });
  });
}

module.exports = {
  initSocketServer,
  onlineUsers
};
