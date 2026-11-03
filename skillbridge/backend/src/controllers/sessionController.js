/**
 * Learning Session Scheduling Controller
 * Enforces calendar overlap conflict prevention, status management, and meeting links.
 */

const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const getSessions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, exchangeId } = req.query;

    let sessions = await db.exchangeSession.findMany({
      where: {
        OR: [{ hostId: userId }, { attendeeId: userId }]
      },
      include: {
        host: { include: { profile: true } },
        attendee: { include: { profile: true } },
        exchange: true
      }
    });

    if (status) {
      sessions = sessions.filter(s => s.status === status);
    }
    if (exchangeId) {
      sessions = sessions.filter(s => s.exchangeId === exchangeId);
    }

    // Sort by startTime ascending
    sessions.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    // Sanitize user passwords
    const sanitized = sessions.map(sess => {
      const copy = { ...sess };
      if (copy.host) {
        const { password, ...h } = copy.host;
        copy.host = h;
      }
      if (copy.attendee) {
        const { password, ...a } = copy.attendee;
        copy.attendee = a;
      }
      return copy;
    });

    return successResponse(res, sanitized, 'Sessions retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await db.exchangeSession.findUnique({
      where: { id },
      include: {
        host: { include: { profile: true } },
        attendee: { include: { profile: true } }
      }
    });

    if (!session) return errorResponse(res, 'Session not found', 404);

    if (session.hostId !== userId && session.attendeeId !== userId && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized to view this session', 403);
    }

    if (session.host) {
      const { password, ...h } = session.host;
      session.host = h;
    }
    if (session.attendee) {
      const { password, ...a } = session.attendee;
      session.attendee = a;
    }

    return successResponse(res, session, 'Session details');
  } catch (err) {
    next(err);
  }
};

const createSession = async (req, res, next) => {
  try {
    const hostId = req.user.id;
    const { exchangeId, attendeeId, title, description, startTime, duration = 60, meetingLink } = req.body;

    if (!exchangeId || !title || !startTime) {
      return errorResponse(res, 'exchangeId, title, and startTime are required', 400);
    }

    const exchange = await db.exchangeRequest.findUnique({ where: { id: exchangeId } });
    if (!exchange) return errorResponse(res, 'Exchange not found', 404);

    // Determine attendee
    const determinedAttendeeId = attendeeId || (exchange.senderId === hostId ? exchange.receiverId : exchange.senderId);

    const start = new Date(startTime);
    const durationMins = parseInt(duration) || 60;
    const end = new Date(start.getTime() + durationMins * 60000);

    // Conflict Prevention Check
    const activeSessions = await db.exchangeSession.findMany({
      where: {
        status: 'SCHEDULED',
        OR: [
          { hostId },
          { attendeeId: hostId },
          { hostId: determinedAttendeeId },
          { attendeeId: determinedAttendeeId }
        ]
      }
    });

    const hasConflict = activeSessions.some(existing => {
      const exStart = new Date(existing.startTime);
      const exEnd = new Date(existing.endTime);
      // Overlap condition: start < exEnd && end > exStart
      return start < exEnd && end > exStart;
    });

    if (hasConflict) {
      return errorResponse(res, 'Schedule Conflict: Either you or your partner already has a confirmed session booked during this time window. Please pick a different time.', 409);
    }

    const defaultMeetingRoom = `https://meet.jit.si/skillbridge-${exchangeId.substring(0, 8)}-${Date.now()}`;

    const newSession = await db.exchangeSession.create({
      data: {
        exchangeId,
        hostId,
        attendeeId: determinedAttendeeId,
        title,
        description: description || '',
        startTime: start,
        endTime: end,
        duration: durationMins,
        meetingLink: meetingLink || defaultMeetingRoom,
        status: 'SCHEDULED'
      },
      include: {
        host: { include: { profile: true } },
        attendee: { include: { profile: true } }
      }
    });

    // Automatically transition exchange request to SCHEDULED if it was ACCEPTED
    if (exchange.status === 'ACCEPTED') {
      await db.exchangeRequest.update({
        where: { id: exchangeId },
        data: { status: 'SCHEDULED' }
      });
    }

    // Notify attendee
    await db.notification.create({
      data: {
        userId: determinedAttendeeId,
        type: 'SESSION_SCHEDULED',
        title: 'New Session Scheduled 📅',
        message: `${req.user.profile?.fullName || req.user.username} scheduled "${title}" on ${start.toLocaleDateString()}.`,
        link: `/dashboard/sessions`
      }
    });

    return successResponse(res, newSession, 'Learning session scheduled successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, startTime, duration, status, notes } = req.body;

    const session = await db.exchangeSession.findUnique({ where: { id } });
    if (!session) return errorResponse(res, 'Session not found', 404);

    if (session.hostId !== userId && session.attendeeId !== userId && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized to update this session', 403);
    }

    let start = session.startTime;
    let end = session.endTime;
    let durationMins = session.duration;

    if (startTime) {
      start = new Date(startTime);
      durationMins = duration ? parseInt(duration) : session.duration;
      end = new Date(start.getTime() + durationMins * 60000);
    }

    const updated = await db.exchangeSession.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(startTime && { startTime: start, endTime: end, duration: durationMins }),
        ...(status && { status }),
        ...(notes !== undefined && { notes })
      }
    });

    // Notify other user
    const otherId = session.hostId === userId ? session.attendeeId : session.hostId;
    await db.notification.create({
      data: {
        userId: otherId,
        type: status === 'CANCELLED' ? 'SESSION_CANCELLED' : 'SESSION_SCHEDULED',
        title: status === 'CANCELLED' ? 'Session Cancelled' : 'Session Updated',
        message: `The session "${session.title}" was updated by ${req.user.profile?.fullName || req.user.username}.`,
        link: `/dashboard/sessions`
      }
    });

    return successResponse(res, updated, 'Session updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await db.exchangeSession.findUnique({ where: { id } });
    if (!session) return errorResponse(res, 'Session not found', 404);

    if (session.hostId !== userId && session.attendeeId !== userId && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized to delete this session', 403);
    }

    await db.exchangeSession.delete({ where: { id } });
    return successResponse(res, null, 'Session cancelled and deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession
};
