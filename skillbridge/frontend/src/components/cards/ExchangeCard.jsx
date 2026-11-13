import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, Check, X, Star, Clock, AlertCircle } from 'lucide-react';

export const ExchangeCard = ({
  exchange,
  currentUserId,
  onAccept,
  onReject,
  onComplete,
  onCancel,
  onOpenScheduleModal,
  onOpenReviewModal
}) => {
  const isSender = exchange.senderId === currentUserId;
  const partner = isSender ? exchange.receiver : exchange.sender;
  const partnerProfile = partner?.profile || {};

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="status-badge status-pending"><Clock size={12} /> Pending Response</span>;
      case 'ACCEPTED':
        return <span className="status-badge status-accepted"><Check size={12} /> Accepted</span>;
      case 'SCHEDULED':
        return <span className="status-badge status-scheduled"><Calendar size={12} /> Scheduled</span>;
      case 'IN_PROGRESS':
        return <span className="status-badge status-in_progress">In Progress</span>;
      case 'COMPLETED':
        return <span className="status-badge status-completed"><Check size={12} /> Completed</span>;
      case 'REJECTED':
        return <span className="status-badge status-rejected"><X size={12} /> Declined</span>;
      case 'CANCELLED':
        return <span className="status-badge status-cancelled">Cancelled</span>;
      default:
        return <span className="status-badge status-pending">{status}</span>;
    }
  };

  return (
    <div className="sb-card p-4 mb-3">
      {/* Top Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <img
            src={partnerProfile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.username || 'user'}`}
            alt={partnerProfile.fullName || partner?.username}
            className="rounded-circle border"
            style={{ width: '44px', height: '44px', objectFit: 'cover' }}
          />
          <div>
            <div className="fw-bold text-dark">{partnerProfile.fullName || partner?.username}</div>
            <div className="text-muted small">
              {isSender ? 'Recipient' : 'Sender'} • Proposed on {new Date(exchange.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {exchange.matchScore && (
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle" style={{ fontSize: '0.75rem' }}>
              {exchange.matchScore}% Compatibility
            </span>
          )}
          {getStatusBadge(exchange.status)}
        </div>
      </div>

      {/* Skills Traded */}
      <div className="row g-3 mb-3 bg-light p-3 rounded-3 border">
        <div className="col-md-6">
          <span className="text-muted small fw-semibold d-block" style={{ fontSize: '0.75rem' }}>
            {isSender ? 'YOU ARE TEACHING:' : 'THEY ARE TEACHING:'}
          </span>
          <span className="fw-bold text-primary">
            {exchange.offeredSkill?.name || 'Skill Being Taught'}
          </span>
        </div>
        <div className="col-md-6">
          <span className="text-muted small fw-semibold d-block" style={{ fontSize: '0.75rem' }}>
            {isSender ? 'YOU ARE LEARNING:' : 'THEY ARE LEARNING:'}
          </span>
          <span className="fw-bold text-indigo" style={{ color: '#6366F1' }}>
            {exchange.wantedSkill?.name || 'Skill Being Learned'}
          </span>
        </div>
      </div>

     
      <div className="mb-3">
        <p className="text-dark small mb-1" style={{ lineHeight: 1.5 }}>
          "{exchange.message}"
        </p>
        {exchange.proposedSchedule 
        && (
          <div className="text-muted small d-flex align-items-center gap-1">
            <Clock size={13} /> Proposed Time: {exchange.proposedSchedule}
          </div>
        )}
      </div>

    
      <div className="d-flex flex-wrap justify-content-end align-items-center gap-2 pt-2 border-top">
        
        {!isSender && exchange.status === 'PENDING' && (
          <>
            <button
              onClick={() => onReject(exchange.id)}
              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
            >
              <X size={14} /> Decline
            </button>
            <button
              onClick={() => onAccept(exchange.id)}
              className="btn btn-sm btn-success d-inline-flex align-items-center gap-1 text-white"
            >
              <Check size={14} /> Accept Proposal
            </button>
          </>
        )}

        
        {isSender && exchange.status === 'PENDING' && (
          <button
            onClick={() => onCancel(exchange.id)}
            className="btn btn-sm btn-outline-secondary"
          >
            Cancel Proposal
          </button>
        )}

        
        {['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS'].includes(exchange.status) && (
          <>
            <Link
              to="/dashboard/messages"
              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
            >
              <MessageSquare size={14} /> Chat
            </Link>
            <button
              onClick={() => onOpenScheduleModal(exchange)}
              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
            >
              <Calendar size={14} /> Schedule Session
            </button>
            <button
              onClick={() => onComplete(exchange.id)}
              className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
            >
              <Check size={14} /> Mark Completed
            </button>
          </>
        )}

        
        {exchange.status === 'COMPLETED' && (
          <button
            onClick={() => onOpenReviewModal(exchange)}
            className="btn btn-sm btn-warning d-inline-flex align-items-center gap-1 text-dark fw-semibold"
          >
            <Star size={14} /> Leave Review
          </button>
        )}
      </div>
    </div>
  );
};

export default ExchangeCard;
