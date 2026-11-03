import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  actionLabel = null,
  actionLink = null,
  onAction = null
}) => {
  return (
    <div className="empty-state my-4">
      <div className="empty-state-icon">
        <Icon size={28} />
      </div>
      <h5 className="fw-bold mb-2 text-dark">{title}</h5>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: '420px', fontSize: '0.95rem' }}>
        {description}
      </p>
      {actionLabel && actionLink && (
        <Link to={actionLink} className="btn btn-primary px-4">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionLink && (
        <button onClick={onAction} className="btn btn-primary px-4">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
