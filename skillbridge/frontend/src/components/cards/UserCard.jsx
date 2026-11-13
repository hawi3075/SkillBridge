import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, GraduationCap, ArrowRight, MessageSquare, CheckCircle } from 'lucide-react';
import StarRating from '../common/StarRating';

export const UserCard = ({ user, onRequestExchange = null }) => {
  const profile = user.profile || {};
  const offered = user.offeredSkills || [];
  const wanted = user.wantedSkills || [];

  return (
    <div className="sb-card sb-card-hover h-100 p-4 d-flex flex-column">
      {/* Top Header */}
      <div className="d-flex align-items-start gap-3 mb-3">
        <div className="position-relative">
          <img
            src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={profile.fullName || user.username}
            className="rounded-circle border"
            style={{ width: '56px', height: '56px', objectFit: 'cover' }}
          />
          {user.role === 'MENTOR' && (
            <span
              className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1"
              title="Verified Mentor"
              style={{ display: 'flex', transform: 'translate(20%, 20%)' }}
            >
              <CheckCircle size={14} />
            </span>
          )}
        </div>

        <div className="flex-grow-1 overflow-hidden">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <h6 className="fw-bold mb-0 text-truncate text-dark">{profile.fullName || user.username}</h6>
            <span className="badge bg-light text-secondary border small" style={{ fontSize: '0.7rem' }}>
              {profile.experienceLevel || 'INTERMEDIATE'}
            </span>
          </div>

          <div className="text-muted small text-truncate mb-1">
            {profile.occupation || 'Skill Enthusiast'}
          </div>

          <div className="d-flex align-items-center gap-2">
            <StarRating rating={profile.averageRating || 5.0} totalReviews={profile.totalReviews || 0} size={13} />
          </div>
        </div>
      </div>

     
      <div className="d-flex flex-wrap gap-2 text-muted small mb-3" style={{ fontSize: '0.8rem' }}>
        {profile.location && (
          <span className="d-inline-flex align-items-center gap-1">
            <MapPin size={13} /> {profile.location}
          </span>
        )}
        {profile.languages && (
          <span className="d-inline-flex align-items-center gap-1">
            🗣️ {profile.languages}
          </span>
        )}
      </div>

      {/* Bio snippet */}
      <p className="text-muted small mb-3 flex-grow-1" style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
        {profile.bio ? (profile.bio.length > 110 ? `${profile.bio.substring(0, 107)}...` : profile.bio) : 'Open to trading skills and mutual learning sessions.'}
      </p>

      {/* Skills Offered (Can Teach) */}
      <div className="mb-2">
        <span className="text-dark fw-semibold small d-block mb-1" style={{ fontSize: '0.78rem' }}>
          CAN TEACH:
        </span>
        <div className="d-flex flex-wrap gap-1">
          {offered.slice(0, 3).map((os, idx) => (
            <span
              key={idx}
              className="badge bg-primary-subtle text-primary border border-primary-subtle"
              style={{ fontSize: '0.75rem', fontWeight: 500 }}
            >
              {os.skill?.name || 'Skill'}
            </span>
          ))}
          {offered.length > 3 && (
            <span className="badge bg-light text-muted border small" style={{ fontSize: '0.7rem' }}>
              +{offered.length - 3} more
            </span>
          )}
          {offered.length === 0 && (
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Listing in progress</span>
          )}
        </div>
      </div>

      {/* Skills Wanted (Wants to Learn) */}
      <div className="mb-4">
        <span className="text-dark fw-semibold small d-block mb-1" style={{ fontSize: '0.78rem' }}>
          WANTS TO LEARN:
        </span>
        <div className="d-flex flex-wrap gap-1">
          {wanted.slice(0, 3).map((ws, idx) => (
            <span
              key={idx}
              className="badge bg-indigo-subtle"
              style={{ fontSize: '0.75rem', fontWeight: 500 }}
            >
              {ws.skill?.name || 'Skill'}
            </span>
          ))}
          {wanted.length > 3 && (
            <span className="badge bg-light text-muted border small" style={{ fontSize: '0.7rem' }}>
              +{wanted.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="d-flex gap-2 pt-2 border-top mt-auto">
        <Link to={`/users/${user.id}`} className="btn btn-sm btn-outline-primary flex-grow-1">
          View Profile
        </Link>
        {onRequestExchange ? (
          <button
            onClick={() => onRequestExchange(user)}
            className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
          >
            <span>Exchange</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <Link
            to={`/dashboard/matches?target=${user.id}`}
            className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
          >
            <span>Match</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserCard;
