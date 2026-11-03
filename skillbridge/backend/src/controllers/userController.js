/**
 * User & Profile Management Controller
 */

const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const getAllUsers = async (req, res, next) => {
  try {
    const {
      search,
      category,
      experienceLevel,
      language,
      role,
      isMentor,
      minRating,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    let users = await db.user.findMany({
      where: {
        isActive: true,
        NOT: req.user ? { id: req.user.id } : undefined
      },
      include: {
        profile: true,
        offeredSkills: { include: { skill: { include: { category: true } } } },
        wantedSkills: { include: { skill: { include: { category: true } } } },
        reviewsReceived: true
      }
    });

    // Apply Filters
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u => {
        const nameMatch = u.profile?.fullName?.toLowerCase().includes(q);
        const usernameMatch = u.username.toLowerCase().includes(q);
        const bioMatch = u.profile?.bio?.toLowerCase().includes(q);
        const skillMatch = (u.offeredSkills || []).some(s => s.skill?.name.toLowerCase().includes(q));
        return nameMatch || usernameMatch || bioMatch || skillMatch;
      });
    }

    if (category) {
      users = users.filter(u => {
        return (u.offeredSkills || []).some(s => s.skill?.categoryId === category || s.skill?.category?.slug === category);
      });
    }

    if (experienceLevel) {
      users = users.filter(u => u.profile?.experienceLevel === experienceLevel);
    }

    if (language) {
      users = users.filter(u => (u.profile?.languages || '').toLowerCase().includes(language.toLowerCase()));
    }

    if (isMentor !== undefined) {
      const mentorBool = isMentor === 'true' || isMentor === true;
      users = users.filter(u => u.role === 'MENTOR' || u.profile?.isMentor === mentorBool);
    }

    if (minRating) {
      const r = parseFloat(minRating);
      users = users.filter(u => (u.profile?.averageRating || 0) >= r);
    }

    // Sorting
    if (sort === 'rating') {
      users.sort((a, b) => (b.profile?.averageRating || 0) - (a.profile?.averageRating || 0));
    } else if (sort === 'exchanges') {
      users.sort((a, b) => (b.profile?.completedExchanges || 0) - (a.profile?.completedExchanges || 0));
    } else if (sort === 'newest') {
      users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Pagination
    const total = users.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginated = users.slice(startIndex, startIndex + parseInt(limit));

    // Sanitize passwords
    const sanitized = paginated.map(u => {
      const { password, ...safe } = u;
      return safe;
    });

    return successResponse(res, sanitized, 'Users fetched successfully', 200, {
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await db.user.findFirst({
      where: {
        OR: [{ id }, { username: id }]
      },
      include: {
        profile: true,
        offeredSkills: { include: { skill: { include: { category: true } } } },
        wantedSkills: { include: { skill: { include: { category: true } } } },
        reviewsReceived: {
          include: {
            reviewer: { include: { profile: true } }
          }
        }
      }
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const { password, ...safeUser } = user;
    return successResponse(res, safeUser, 'User profile retrieved');
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      fullName,
      bio,
      location,
      education,
      occupation,
      experienceLevel,
      languages,
      availability,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      twitterUrl,
      isMentor,
      mentorBio,
      mentorHourlyRate
    } = req.body;

    const updatedProfile = await db.profile.update({
      where: { userId },
      data: {
        ...(fullName && { fullName }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(education !== undefined && { education }),
        ...(occupation !== undefined && { occupation }),
        ...(experienceLevel && { experienceLevel }),
        ...(languages && { languages }),
        ...(availability !== undefined && { availability }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(portfolioUrl !== undefined && { portfolioUrl }),
        ...(twitterUrl !== undefined && { twitterUrl }),
        ...(isMentor !== undefined && { isMentor: Boolean(isMentor) }),
        ...(mentorBio !== undefined && { mentorBio }),
        ...(mentorHourlyRate !== undefined && { mentorHourlyRate: parseFloat(mentorHourlyRate) || 0 })
      }
    });

    // If user enabled mentorship, promote role to MENTOR if regular USER
    if (isMentor && req.user.role === 'USER') {
      await db.user.update({
        where: { id: userId },
        data: { role: 'MENTOR' }
      });
    }

    return successResponse(res, updatedProfile, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No image file uploaded', 400);
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const updated = await db.profile.update({
      where: { userId: req.user.id },
      data: { avatarUrl }
    });

    return successResponse(res, { avatarUrl: updated.avatarUrl }, 'Avatar uploaded successfully');
  } catch (err) {
    next(err);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    await db.user.delete({ where: { id: req.user.id } });
    return successResponse(res, null, 'Account deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateProfile,
  uploadAvatar,
  deleteAccount
};
