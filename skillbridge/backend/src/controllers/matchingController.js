/**
 * Smart Matching Controller
 */

const db = require('../config/db');
const { calculateMatchScore } = require('../services/matchingService');
const { successResponse, errorResponse } = require('../utils/response');

const getMatches = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    const currentUser = await db.user.findUnique({
      where: { id: currentUserId },
      include: {
        profile: true,
        offeredSkills: { include: { skill: { include: { category: true } } } },
        wantedSkills: { include: { skill: { include: { category: true } } } }
      }
    });

    if (!currentUser) {
      return errorResponse(res, 'Current user not found', 404);
    }

    const allCandidates = await db.user.findMany({
      where: {
        isActive: true,
        NOT: { id: currentUserId }
      },
      include: {
        profile: true,
        offeredSkills: { include: { skill: { include: { category: true } } } },
        wantedSkills: { include: { skill: { include: { category: true } } } }
      }
    });

    const scoredMatches = allCandidates
      .map(candidate => calculateMatchScore(currentUser, candidate))
      .filter(Boolean)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Sanitize candidate passwords
    const sanitized = scoredMatches.map(m => {
      const { password, ...safeCandidate } = m.candidate;
      return {
        ...m,
        candidate: safeCandidate
      };
    });

    return successResponse(res, sanitized, 'Compatible matches calculated successfully');
  } catch (err) {
    next(err);
  }
};

const getMatchWithUser = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const { targetUserId } = req.params;

    const currentUser = await db.user.findUnique({
      where: { id: currentUserId },
      include: {
        profile: true,
        offeredSkills: { include: { skill: true } },
        wantedSkills: { include: { skill: true } }
      }
    });

    const targetUser = await db.user.findUnique({
      where: { id: targetUserId },
      include: {
        profile: true,
        offeredSkills: { include: { skill: true } },
        wantedSkills: { include: { skill: true } }
      }
    });

    if (!targetUser) {
      return errorResponse(res, 'Target user not found', 404);
    }

    const matchResult = calculateMatchScore(currentUser, targetUser);
    if (matchResult && matchResult.candidate) {
      const { password, ...safeCandidate } = matchResult.candidate;
      matchResult.candidate = safeCandidate;
    }

    return successResponse(res, matchResult, 'Direct compatibility score calculated');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMatches,
  getMatchWithUser
};
