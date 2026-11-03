import React from 'react';
import { Calendar, Clock, Video, Check, X, User } from 'lucide-react';

export const SessionCard = ({ session, currentUserId, onUpdateStatus }) => {
  const isHost = session.hostId === currentUserId;
  const partner = isHost ? session.attendee : session.host;
  const partnerProfile = partner?.profile || {};

  const startDate = new Date(session.startTime);
  const formattedDate = startDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = startDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return <span className="status-badge status-scheduled">Scheduled</span>;
      case 'IN_PROGRESS':
        return <span className="status-badge status-in_progress">Live Now</span>;
      case 'COMPLETED':
        return <span className="status-badge status-completed">Completed</span>;
      case 'CANCELLED':
        return <span className="status-badge status-cancelled">Cancelled</span>;
      default:
        return <span className="status-badge status-pending">{status}</span>;
    }
  };

  return (
    <div className="sb-card p-4 mb-3">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
        <div>
          <h5 className="fw-bold mb-1 text-dark">{session.title}</h5>
          {session.description && (
            <p className="text-muted small mb-2" style={{ lineHeight: 1.5 }}>
              {session.description}
            </p>
          )}
          <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
            <span className="d-inline-flex align-items-center gap-1 text-dark fw-medium">
              <Calendar size={14} color="#2563EB" /> {formattedDate}
            </span>
            <span className="d-inline-flex align-items-center gap-1">
              <Clock size={14} /> {formattedTime} ({session.duration} mins)
            </span>
            <span className="d-inline-flex align-items-center gap-1">
              <User size={14} /> With: <strong>{partnerProfile.fullName || partner?.username}</strong>
            </span>
          </div>
        </div>

        <div>{getStatusBadge(session.status)}</div>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-3 border-top">
        {session.meetingLink && session.status !== 'CANCELLED' ? (
          <a
            href={session.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-primary d-inline-flex align-items-center gap-2"
          >
            <Video size={16} />
            <span>Join Meeting Room</span>
          </a>
        ) : (
          <div className="text-muted small">No active meeting link</div>
        )}

        {session.status === 'SCHEDULED' && (
          <div className="d-flex gap-2">
            <button
              onClick={() => onUpdateStatus(session.id, 'COMPLETED')}
              className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
            >
              <Check size={14} /> Mark Finished
            </button>
            <button
              onClick={() => onUpdateStatus(session.id, 'CANCELLED')}
              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
            >
              <X size={14} /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
