/**
 * Reviews & Ratings Controller
 * Enforces review eligibility on COMPLETED exchanges and prevents duplicate submissions.
 */

const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const createReview = async (req, res, next) => {
  try {
    const reviewerId = req.user.id;
    const { exchangeId, rating, comment } = req.body;

    if (!exchangeId || !rating || !comment) {
      return errorResponse(res, 'exchangeId, rating, and comment are required', 400);
    }

    const ratingNum = parseInt(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      return errorResponse(res, 'Rating must be between 1 and 5 stars', 400);
    }

    // 1. Verify exchange exists and is COMPLETED
    const exchange = await db.exchangeRequest.findUnique({
      where: { id: exchangeId },
      include: { sender: true, receiver: true }
    });

    if (!exchange) {
      return errorResponse(res, 'Exchange request not found', 404);
    }

    if (exchange.status !== 'COMPLETED') {
      return errorResponse(res, 'Only verified completed skill exchanges are eligible for reviews', 400);
    }

    // 2. Verify reviewer is a participant
    if (exchange.senderId !== reviewerId && exchange.receiverId !== reviewerId) {
      return errorResponse(res, 'You are not a participant in this exchange', 403);
    }

    const revieweeId = exchange.senderId === reviewerId ? exchange.receiverId : exchange.senderId;

    // 3. Prevent duplicate reviews
    const existingReview = await db.review.findFirst({
      where: { exchangeId, reviewerId }
    });

    if (existingReview) {
      return errorResponse(res, 'You have already submitted a review for this completed exchange', 409);
    }

    // 4. Create review
    const review = await db.review.create({
      data: {
        exchangeId,
        reviewerId,
        revieweeId,
        rating: ratingNum,
        comment: comment.trim()
      },
      include: {
        reviewer: { include: { profile: true } },
        reviewee: { include: { profile: true } }
      }
    });

    // Notify reviewee
    await db.notification.create({
      data: {
        userId: revieweeId,
        type: 'NEW_REVIEW',
        title: 'New Review Received! ⭐',
        message: `${req.user.profile?.fullName || req.user.username} gave you a ${ratingNum}-star review.`,
        link: `/dashboard/reviews`
      }
    });

    return successResponse(res, review, 'Review submitted successfully', 201);
  } catch (err) {
    next(err);
  }
};

const getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const reviews = await db.review.findMany({
      where: {
        revieweeId: userId,
        isModerated: false
      },
      include: {
        reviewer: { include: { profile: true } },
        exchange: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const sanitized = reviews.map(r => {
      const copy = { ...r };
      if (copy.reviewer) {
        const { password, ...safe } = copy.reviewer;
        copy.reviewer = safe;
      }
      return copy;
    });

    return successResponse(res, sanitized, 'User reviews retrieved');
  } catch (err) {
    next(err);
  }
};

const moderateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isModerated } = req.body;

    const updated = await db.review.update({
      where: { id },
      data: { isModerated: Boolean(isModerated) }
    });

    return successResponse(res, updated, 'Review moderation status updated');
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.review.delete({ where: { id } });
    return successResponse(res, null, 'Review deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReview,
  getUserReviews,
  moderateReview,
  deleteReview
};
