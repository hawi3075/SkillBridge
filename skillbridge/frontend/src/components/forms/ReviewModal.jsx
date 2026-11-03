import React, { useState } from 'react';
import Modal from '../common/Modal';
import StarRating from '../common/StarRating';
import { reviewApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Star } from 'lucide-react';

export const ReviewModal = ({ isOpen, onClose, exchange, onSuccess }) => {
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || comment.length < 5) {
      showToast('Please provide at least a few words of feedback (min 5 characters)', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await reviewApi.createReview({
        exchangeId: exchange.id,
        rating,
        comment: comment.trim()
      });

      if (res.success) {
        showToast('Thank you! Your review has been submitted.', 'success');
        if (onSuccess) onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Leave Peer Review & Feedback"
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4 text-center">
          <label className="form-label d-block text-muted small fw-semibold mb-2">
            RATE YOUR LEARNING EXPERIENCE
          </label>
          <div className="d-flex justify-content-center">
            <StarRating
              rating={rating}
              size={28}
              interactive={true}
              onRatingChange={(newVal) => setRating(newVal)}
            />
          </div>
          <span className="small fw-bold text-dark mt-2 d-inline-block">
            {rating === 5 ? 'Exceptional! 🌟' : rating === 4 ? 'Great Session 👍' : rating === 3 ? 'Good / Average' : 'Needs Improvement'}
          </span>
        </div>

        <div className="mb-4">
          <label className="form-label small fw-semibold text-dark">Written Feedback</label>
          <textarea
            className="form-control"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you learn? How clear and helpful was the peer mentor? Share your honest experience..."
            required
            minLength={5}
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" onClick={onClose} className="btn btn-light" disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-1" disabled={submitting}>
            <Star size={16} />
            <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;
