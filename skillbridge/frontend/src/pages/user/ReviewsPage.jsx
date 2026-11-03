import React, { useState, useEffect } from 'react';
import { reviewApi, exchangeApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/common/StarRating';
import ReviewModal from '../../components/forms/ReviewModal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Star, MessageSquare, Award, CheckCircle } from 'lucide-react';

export const ReviewsPage = () => {
  const { user } = useAuth();
  const profile = user?.profile || {};

  const [reviews, setReviews] = useState([]);
  const [completedExchanges, setCompletedExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExchangeForReview, setSelectedExchangeForReview] = useState(null);

  useEffect(() => {
    fetchReviewData();
  }, [user]);

  const fetchReviewData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [revRes, exRes] = await Promise.all([
        reviewApi.getUserReviews(user.id),
        exchangeApi.getExchanges({ status: 'COMPLETED' })
      ]);

      if (revRes.success) setReviews(revRes.data || []);
      if (exRes.success) {
        // Find completed exchanges where user hasn't written a review yet
        const existingReviewedExchangeIds = (revRes.data || []).map(r => r.exchangeId);
        const pendingReviews = (exRes.data || []).filter(e => !existingReviewedExchangeIds.includes(e.id));
        setCompletedExchanges(pendingReviews);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Reviews & Reputation</h4>
          <span className="text-muted small">Verified peer ratings from your completed skill exchanges.</span>
        </div>
      </div>

      {/* Rating Summary Card */}
      <div className="sb-card p-4 bg-white mb-4">
        <div className="row align-items-center g-4 text-center text-md-start">
          <div className="col-md-4 text-center border-md-end">
            <h1 className="display-4 fw-extrabold text-dark mb-1">
              {Number(profile.averageRating || 5.0).toFixed(1)}
            </h1>
            <div className="mb-2">
              <StarRating rating={profile.averageRating || 5.0} size={20} />
            </div>
            <span className="text-muted small">Based on {reviews.length} peer reviews</span>
          </div>

          <div className="col-md-8">
            <h6 className="fw-bold text-dark mb-2">Verified Peer Rating System</h6>
            <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
              On SkillBridge, reviews can strictly only be submitted after a skill exchange is marked as completed. This prevents artificial reviews and ensures our marketplace is grounded in authentic peer learning experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Completed Exchanges Awaiting Your Review */}
      {completedExchanges.length > 0 && (
        <div className="sb-card p-4 bg-primary-subtle border-primary-subtle mb-4">
          <h6 className="fw-bold text-primary mb-2">Completed Exchanges Awaiting Your Feedback</h6>
          <p className="text-muted small mb-3">
            Share your feedback to help your learning partners build their reputation.
          </p>

          <div className="d-flex flex-column gap-2">
            {completedExchanges.map((ex) => (
              <div key={ex.id} className="p-3 bg-white rounded-3 border d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold small text-dark">
                    Exchange with {ex.senderId === user.id ? ex.receiver?.profile?.fullName || ex.receiver?.username : ex.sender?.profile?.fullName || ex.sender?.username}
                  </div>
                  <div className="text-muted small" style={{ fontSize: '0.78rem' }}>
                    Taught: {ex.offeredSkill?.name} • Learned: {ex.wantedSkill?.name}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedExchangeForReview(ex)}
                  className="btn btn-sm btn-warning text-dark fw-bold d-inline-flex align-items-center gap-1"
                >
                  <Star size={14} />
                  <span>Leave Review</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <h5 className="fw-bold text-dark mb-3">Received Reviews</h5>
      {loading ? (
        <LoadingSkeleton count={3} type="table" />
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Complete your first skill exchange session to receive ratings and written feedback from your peers!"
          actionLabel="View Active Exchanges"
          actionLink="/dashboard/exchanges"
        />
      ) : (
        reviews.map((r) => {
          const reviewer = r.reviewer || {};
          const reviewerProf = reviewer.profile || {};
          return (
            <div key={r.id} className="sb-card p-4 bg-white mb-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={reviewerProf.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reviewer.username || 'user'}`}
                    alt={reviewerProf.fullName || reviewer.username}
                    className="rounded-circle border"
                    style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="fw-bold text-dark mb-0">{reviewerProf.fullName || reviewer.username}</h6>
                    <span className="text-muted small">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <StarRating rating={r.rating} size={15} />
              </div>

              <p className="text-dark small mb-0 mt-3" style={{ lineHeight: 1.6 }}>
                "{r.comment}"
              </p>
            </div>
          );
        })
      )}

      {/* Review Modal */}
      {selectedExchangeForReview && (
        <ReviewModal
          isOpen={!!selectedExchangeForReview}
          onClose={() => setSelectedExchangeForReview(null)}
          exchange={selectedExchangeForReview}
          onSuccess={fetchReviewData}
        />
      )}
    </div>
  );
};

export default ReviewsPage;
