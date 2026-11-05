/**
 * Skill Exchange Management Controller
 * Handles full exchange workflow: PENDING -> ACCEPTED -> SCHEDULED -> IN_PROGRESS -> COMPLETED / REJECTED / CANCELLED
 */

const db = require('../config/db');
const { calculateMatchScore } = require('../services/matchingService');
const { successResponse, errorResponse } = require('../utils/response');

const getExchanges = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, type } = req.query; // type: 'sent', 'received', or undefined

    let exchanges = await db.exchangeRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
        offeredSkill: true,
        wantedSkill: true,
        sessions: true,
        reviews: true
      }
    });

    if (status) {
      exchanges = exchanges.filter(e => e.status === status);
    }
    if (type === 'sent') {
      exchanges = exchanges.filter(e => e.senderId === userId);
    } else if (type === 'received') {
      exchanges = exchanges.filter(e => e.receiverId === userId);
    }

    // Sort newest first
    exchanges.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Sanitize passwords
    const sanitized = exchanges.map(e => {
      const copy = { ...e };
      if (copy.sender) {
        const { password, ...s } = copy.sender;
        copy.sender = s;
      }
      if (copy.receiver) {
        const { password, ...r } = copy.receiver;
        copy.receiver = r;
      }
      return copy;
    });

    return successResponse(res, sanitized, 'Exchange requests fetched');
  } catch (err) {
    next(err);
  }
};

const getExchangeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const exchange = await db.exchangeRequest.findUnique({
      where: { id },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
        offeredSkill: true,
        wantedSkill: true,
        sessions: {
          include: {
            host: { include: { profile: true } },
            attendee: { include: { profile: true } }
          }
        },
        reviews: true
      }
    });

    if (!exchange) {
      return errorResponse(res, 'Exchange request not found', 404);
    }

    if (exchange.senderId !== userId && exchange.receiverId !== userId && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized to view this exchange', 403);
    }

    if (exchange.sender) {
      const { password, ...s } = exchange.sender;
      exchange.sender = s;
    }
    if (exchange.receiver) {
      const { password, ...r } = exchange.receiver;
      exchange.receiver = r;
    }

    return successResponse(res, exchange, 'Exchange request details');
  } catch (err) {
    next(err);
  }
};

const sendExchangeRequest = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiverId, offeredSkillId, wantedSkillId, message, proposedSchedule } = req.body;

    if (senderId === receiverId) {
      return errorResponse(res, 'You cannot create a skill exchange with yourself', 400);
    }

    const receiver = await db.user.findUnique({
      where: { id: receiverId },
      include: { profile: true, offeredSkills: { include: { skill: true } }, wantedSkills: { include: { skill: true } } }
    });

    if (!receiver) {
      return errorResponse(res, 'Target user does not exist', 404);
    }

    const sender = await db.user.findUnique({
      where: { id: senderId },
      include: { profile: true, offeredSkills: { include: { skill: true } }, wantedSkills: { include: { skill: true } } }
    });

    const matchScoreResult = calculateMatchScore(sender, receiver);
    const matchScore = matchScoreResult ? matchScoreResult.matchPercentage : 80;

    const newExchange = await db.exchangeRequest.create({
      data: {
        senderId,
        receiverId,
        offeredSkillId,
        wantedSkillId,
        message,
        proposedSchedule: proposedSchedule || 'Flexible',
        status: 'PENDING',
        matchScore
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
        offeredSkill: true,
        wantedSkill: true
      }
    });

    // Notify receiver
    await db.notification.create({
      data: {
        userId: receiverId,
        type: 'EXCHANGE_REQUEST',
        title: 'New Skill Exchange Proposal! 🤝',
        message: `${sender.profile?.fullName || sender.username} invited you to exchange skills.`,
        link: `/dashboard/exchanges`
      }
    });

    return successResponse(res, newExchange, 'Skill exchange proposal sent successfully', 201);
  } catch (err) {
    next(err);
  }
};

const acceptExchange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const exchange = await db.exchangeRequest.findUnique({ where: { id } });
    if (!exchange) return errorResponse(res, 'Exchange not found', 404);

    if (exchange.receiverId !== userId && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Only the recipient can accept this proposal', 403);
    }

    if (exchange.status !== 'PENDING') {
      return errorResponse(res, `Cannot accept an exchange with status ${exchange.status}`, 400);
    }

    const updated = await db.exchangeRequest.update({
      where: { id },
      data: { status: 'ACCEPTED' }
    });

    // Automatically create or link a 1-on-1 conversation
    let conv = await db.conversation.findUnique({ where: { exchangeId: id } });
    if (!conv) {
      conv = await db.conversation.create({
        data: {
          exchangeId: id,
          participants: {
            create: [
              { userId: exchange.senderId },
              { userId: exchange.receiverId }
            ]
          }
        }
      });
      // Add initial greeting message
      await db.message.create({
        data: {
          conversationId: conv.id,
          senderId: userId,
          content: "Proposal accepted! Let's schedule our first learning session."
        }
      });
    }

    // Notify sender
    await db.notification.create({
      data: {
        userId: exchange.senderId,
        type: 'REQUEST_ACCEPTED',
        title: 'Exchange Proposal Accepted! 🎉',
        message: `${req.user.profile?.fullName || req.user.username} accepted your skill exchange proposal. You can now chat and schedule sessions!`,
        link: `/dashboard/exchanges`
      }
    });

    return successResponse(res, updated, 'Exchange proposal accepted');
  } catch (err) {
    next(err);
  }
};

const rejectExchange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const exchange = await db.exchangeRequest.findUnique({ where: { id } });
    if (!exchange) return errorResponse(res, 'Exchange not found', 404);

    if (exchange.receiverId !== userId && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Only the recipient can decline this proposal', 403);
    }

    const updated = await db.exchangeRequest.update({
      where: { id },
      data: { status: 'REJECTED' }
    });

    // Notify sender
    await db.notification.create({
      data: {
        userId: exchange.senderId,
        type: 'REQUEST_REJECTED',
        title: 'Exchange Proposal Update',
        message: `${req.user.profile?.fullName || req.user.username} was unable to accept your skill exchange proposal at this time.`,
        link: `/dashboard/exchanges`
      }
    });

    return successResponse(res, updated, 'Exchange proposal declined');
  } catch (err) {
    next(err);
  }
};

const completeExchange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const exchange = await db.exchangeRequest.findUnique({ where: { id } });
    if (!exchange) return errorResponse(res, 'Exchange not found', 404);

    if (exchange.senderId !== userId && exchange.receiverId !== userId && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized to complete this exchange', 403);
    }

    const updated = await db.exchangeRequest.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });

    // Increment completed exchanges on profiles
    const profSender = await db.profile.findUnique({ where: { userId: exchange.senderId } });
    if (profSender) {
      await db.profile.update({
        where: { userId: exchange.senderId },
        data: { completedExchanges: (profSender.completedExchanges || 0) + 1 }
      });
    }

    const profReceiver = await db.profile.findUnique({ where: { userId: exchange.receiverId } });
    if (profReceiver) {
      await db.profile.update({
        where: { userId: exchange.receiverId },
        data: { completedExchanges: (profReceiver.completedExchanges || 0) + 1 }
      });
    }

    // Notify both to leave reviews
    const otherId = userId === exchange.senderId ? exchange.receiverId : exchange.senderId;
    await db.notification.create({
      data: {
        userId: otherId,
        type: 'EXCHANGE_COMPLETED',
        title: 'Exchange Marked Completed! 🌟',
        message: 'Your peer marked the skill exchange as completed. Please leave a rating and review.',
        link: `/dashboard/reviews`
      }
    });

    return successResponse(res, updated, 'Exchange marked as completed');
  } catch (err) {
    next(err);
  }
};

const cancelExchange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const exchange = await db.exchangeRequest.findUnique({ where: { id } });
    if (!exchange) return errorResponse(res, 'Exchange not found', 404);

    if (exchange.senderId !== userId && exchange.receiverId !== userId && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized to cancel this exchange', 403);
    }

    const updated = await db.exchangeRequest.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    const otherId = userId === exchange.senderId ? exchange.receiverId : exchange.senderId;
    await db.notification.create({
      data: {
        userId: otherId,
        type: 'SYSTEM',
        title: 'Exchange Cancelled',
        message: 'A skill exchange was cancelled.',
        link: `/dashboard/exchanges`
      }
    });

    return successResponse(res, updated, 'Exchange cancelled');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getExchanges,
  getExchangeById,
  sendExchangeRequest,
  acceptExchange,
  rejectExchange,
  completeExchange,
  cancelExchange
};
