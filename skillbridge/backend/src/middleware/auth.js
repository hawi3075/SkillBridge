/**
 * Authentication & Authorization Middleware
 */

const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const db = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication token required', 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return errorResponse(res, 'Invalid or expired token', 401);
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId || decoded.id },
      include: { profile: true }
    });

    if (!user) {
      return errorResponse(res, 'User account no longer exists', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account has been suspended. Please contact platform administrators.', 403);
    }

    // Attach sanitized user to request
    const { password, ...sanitizedUser } = user;
    req.user = sanitizedUser;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return errorResponse(res, 'Authentication error', 500);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      const user = await db.user.findUnique({
        where: { id: decoded.userId || decoded.id },
        include: { profile: true }
      });
      if (user && user.isActive) {
        const { password, ...sanitizedUser } = user;
        req.user = sanitizedUser;
      }
    }
  } catch (e) {
    // Ignore invalid tokens for optional auth
  }
  next();
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Unauthorized', 401);
    }
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, `Forbidden: Requires one of [${roles.join(', ')}] role`, 403);
    }
    next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  requireRole
};
