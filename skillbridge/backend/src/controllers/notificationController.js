/**
 * Notifications Controller
 */

const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { unreadOnly } = req.query;

    const notifications = await db.notification.findMany({
      where: {
        userId,
        ...(unreadOnly === 'true' && { isRead: false })
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const unreadCount = await db.notification.count({
      where: { userId, isRead: false }
    });

    return successResponse(res, notifications, 'Notifications retrieved', 200, { unreadCount });
  } catch (err) {
    next(err);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await db.notification.update({
      where: { id },
      data: { isRead: true }
    });
    return successResponse(res, notification, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await db.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
    return successResponse(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
