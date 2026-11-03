/**
 * Authentication Controller
 */

const crypto = require('crypto');
const db = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { email, username, password, fullName, role, isMentor } = req.body;

    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) {
      return errorResponse(res, 'An account with this email already exists', 409);
    }

    const existingUsername = await db.user.findUnique({ where: { username } });
    if (existingUsername) {
      return errorResponse(res, 'This username is already taken', 409);
    }

    const hashedPassword = await hashPassword(password);
    const assignedRole = role === 'MENTOR' ? 'MENTOR' : 'USER';

    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: assignedRole,
        isVerified: true,
        isActive: true,
        profile: {
          create: {
            fullName: fullName || username,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
            bio: isMentor ? 'Passionate mentor eager to share skills and guide fellow learners.' : 'Skill enthusiast looking to trade knowledge and learn new abilities.',
            location: 'Remote / Global',
            languages: 'English',
            isMentor: Boolean(isMentor || assignedRole === 'MENTOR'),
            experienceLevel: 'INTERMEDIATE'
          }
        }
      },
      include: {
        profile: true
      }
    });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    // Create a welcome notification
    await db.notification.create({
      data: {
        userId: newUser.id,
        type: 'SYSTEM',
        title: 'Welcome to SkillBridge! 🎉',
        message: 'Your profile has been created. Start by adding the skills you can teach and what you want to learn!',
        link: '/profile/edit'
      }
    });

    const { password: _, ...sanitizedUser } = newUser;
    return successResponse(res, { token, user: sanitizedUser }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: { contains: email } },
          { username: { contains: email } }
        ]
      },
      include: {
        profile: true,
        offeredSkills: { include: { skill: true } },
        wantedSkills: { include: { skill: true } }
      }
    });

    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account has been deactivated or suspended by an administrator.', 403);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const { password: _, ...sanitizedUser } = user;
    return successResponse(res, { token, user: sanitizedUser }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        offeredSkills: { include: { skill: true } },
        wantedSkills: { include: { skill: true } }
      }
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const unreadNotifications = await db.notification.count({
      where: { userId: user.id, isRead: false }
    });

    const activeExchanges = await db.exchangeRequest.count({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
        status: 'IN_PROGRESS'
      }
    });

    const { password: _, ...sanitizedUser } = user;
    sanitizedUser.unreadNotificationsCount = unreadNotifications;
    sanitizedUser.activeExchangesCount = activeExchanges;

    return successResponse(res, sanitizedUser, 'User profile fetched');
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      // Return success even if not found to prevent user enumeration
      return successResponse(res, null, 'If that email exists, password reset instructions have been sent.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt
      }
    });

    // In local/demo environment, we return the token in response or console log for easy testing
    return successResponse(res, { resetToken }, 'Password reset token generated successfully.');
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
      return errorResponse(res, 'Valid reset token and new password (min 6 chars) are required', 400);
    }

    const resetRecord = await db.passwordResetToken.findUnique({ where: { token } });
    if (!resetRecord || new Date() > new Date(resetRecord.expiresAt)) {
      return errorResponse(res, 'Invalid or expired password reset token', 400);
    }

    const hashedPassword = await hashPassword(newPassword);
    await db.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword }
    });

    await db.passwordResetToken.delete({ where: { token } });

    return successResponse(res, null, 'Password has been successfully reset. You can now log in.');
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return errorResponse(res, 'New password must be at least 6 characters', 400);
    }

    const user = await db.user.findUnique({ where: { id: req.user.id } });
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    const hashedPassword = await hashPassword(newPassword);
    await db.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    return successResponse(res, null, 'Password updated successfully');
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res) => {
  return successResponse(res, null, 'Logged out successfully');
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout
};
