import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, totalReviews = null, size = 16, interactive = false, onRatingChange = null }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="d-inline-flex align-items-center gap-1">
      <div className="star-rating d-flex">
        {stars.map((s) => {
          const isFilled = s <= Math.round(rating);
          return (
            <Star
              key={s}
              size={size}
              fill={isFilled ? '#F59E0B' : 'none'}
              color={isFilled ? '#F59E0B' : '#CBD5E1'}
              style={{ cursor: interactive ? 'pointer' : 'default' }}
              onClick={() => interactive && onRatingChange && onRatingChange(s)}
            />
          );
        })}
      </div>
      <span className="ms-1 fw-bold text-dark" style={{ fontSize: `${size * 0.9}px` }}>
        {Number(rating).toFixed(1)}
      </span>
      {totalReviews !== null && (
        <span className="text-muted ms-1" style={{ fontSize: `${size * 0.8}px` }}>
          ({totalReviews})
        </span>
      )}
    </div>
  );
};

export default StarRating;
