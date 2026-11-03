/**
 * Admin Panel & Platform Analytics Controller
 */

const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await db.user.count({});
    const activeUsers = await db.user.count({ where: { isActive: true } });
    const totalMentors = await db.user.count({ where: { role: 'MENTOR' } });
    const totalSkills = await db.skill.count({});
    const totalCategories = await db.skillCategory.count({});
    const totalExchanges = await db.exchangeRequest.count({});
    const completedExchanges = await db.exchangeRequest.count({ where: { status: 'COMPLETED' } });
    const pendingReports = await db.report.count({ where: { status: 'PENDING' } });
    const totalReviews = await db.review.count({});

    // Growth and activity metrics over time (synthetic grouped by months for analytics chart)
    const growthMetrics = [
      { month: 'Jun', users: 4, exchanges: 3, sessions: 5 },
      { month: 'Jul', users: 7, exchanges: 8, sessions: 11 },
      { month: 'Aug', users: 11, exchanges: 14, sessions: 19 },
      { month: 'Sep', users: 13, exchanges: 19, sessions: 25 },
      { month: 'Oct', users: 15, exchanges: 26, sessions: 32 },
      { month: 'Nov', users: totalUsers, exchanges: totalExchanges, sessions: 38 }
    ];

    // Skill distribution by category
    const categories = await db.skillCategory.findMany({ include: { skills: true } });
    const categoryDistribution = categories.map(cat => ({
      name: cat.name,
      skillsCount: (cat.skills || []).length
    }));

    // Status breakdown of exchanges
    const allExchanges = await db.exchangeRequest.findMany({});
    const exchangeStatusBreakdown = {
      PENDING: allExchanges.filter(e => e.status === 'PENDING').length,
      ACCEPTED: allExchanges.filter(e => e.status === 'ACCEPTED').length,
      SCHEDULED: allExchanges.filter(e => e.status === 'SCHEDULED').length,
      IN_PROGRESS: allExchanges.filter(e => e.status === 'IN_PROGRESS').length,
      COMPLETED: allExchanges.filter(e => e.status === 'COMPLETED').length,
      CANCELLED: allExchanges.filter(e => e.status === 'CANCELLED').length,
      REJECTED: allExchanges.filter(e => e.status === 'REJECTED').length
    };

    return successResponse(res, {
      summary: {
        totalUsers,
        activeUsers,
        totalMentors,
        totalSkills,
        totalCategories,
        totalExchanges,
        completedExchanges,
        pendingReports,
        totalReviews
      },
      growthMetrics,
      categoryDistribution,
      exchangeStatusBreakdown
    }, 'Admin dashboard statistics retrieved');
  } catch (err) {
    next(err);
  }
};

const getAdminUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;

    let users = await db.user.findMany({
      include: {
        profile: true,
        offeredSkills: { include: { skill: true } },
        wantedSkills: { include: { skill: true } }
      }
    });

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u =>
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.profile?.fullName?.toLowerCase().includes(q)
      );
    }

    if (role) {
      users = users.filter(u => u.role === role);
    }

    if (status !== undefined) {
      const isActive = status === 'active' || status === 'true';
      users = users.filter(u => u.isActive === isActive);
    }

    const total = users.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginated = users.slice(startIndex, startIndex + parseInt(limit));

    const sanitized = paginated.map(u => {
      const { password, ...safe } = u;
      return safe;
    });

    return successResponse(res, sanitized, 'Admin users list retrieved', 200, {
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    next(err);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive, role } = req.body;

    const user = await db.user.findUnique({ where: { id } });
    if (!user) return errorResponse(res, 'User not found', 404);

    const updated = await db.user.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(role && { role })
      },
      include: { profile: true }
    });

    const { password, ...safe } = updated;
    return successResponse(res, safe, 'User status updated');
  } catch (err) {
    next(err);
  }
};

const getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const reports = await db.report.findMany({
      where: status ? { status } : {},
      include: {
        reporter: { include: { profile: true } },
        reportedUser: { include: { profile: true } }
      }
    });

    const sanitized = reports.map(r => {
      const copy = { ...r };
      if (copy.reporter) {
        const { password, ...p1 } = copy.reporter;
        copy.reporter = p1;
      }
      if (copy.reportedUser) {
        const { password, ...p2 } = copy.reportedUser;
        copy.reportedUser = p2;
      }
      return copy;
    });

    return successResponse(res, sanitized, 'Platform reports retrieved');
  } catch (err) {
    next(err);
  }
};

const createReport = async (req, res, next) => {
  try {
    const reporterId = req.user.id;
    const { reportedUserId, reason, details } = req.body;

    if (!reportedUserId || !reason || !details) {
      return errorResponse(res, 'reportedUserId, reason, and details are required', 400);
    }

    const report = await db.report.create({
      data: {
        reporterId,
        reportedUserId,
        reason,
        details,
        status: 'PENDING'
      }
    });

    return successResponse(res, report, 'Report submitted to moderators', 201);
  } catch (err) {
    next(err);
  }
};

const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolution } = req.body;

    const updated = await db.report.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(resolution && { resolution })
      }
    });

    return successResponse(res, updated, 'Report status updated');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminDashboardStats,
  getAdminUsers,
  updateUserStatus,
  getReports,
  createReport,
  updateReportStatus
};
