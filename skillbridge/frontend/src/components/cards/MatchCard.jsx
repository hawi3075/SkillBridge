import React, { useState } from 'react';
import { Sparkles, ArrowRightLeft, MapPin, CheckCircle, ChevronDown, ChevronUp, Send } from 'lucide-react';
import StarRating from '../common/StarRating';

export const MatchCard = ({ match, onProposeExchange }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const candidate = match.candidate || {};
  const profile = candidate.profile || {};
  const score = match.matchPercentage || 80;
  const breakdown = match.scoreBreakdown || {};

  return (
    <div className="sb-card p-4 mb-4">
      <div className="row align-items-center g-4">
        {/* Candidate Profile Column */}
        <div className="col-lg-5">
          <div className="d-flex align-items-center gap-3">
            <img
              src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.username}`}
              alt={profile.fullName || candidate.username}
              className="rounded-circle border"
              style={{ width: '64px', height: '64px', objectFit: 'cover' }}
            />
            <div>
              <div className="d-flex align-items-center gap-2">
                <h5 className="fw-bold mb-0 text-dark">{profile.fullName || candidate.username}</h5>
                {candidate.role === 'MENTOR' && (
                  <span className="badge bg-primary text-white small" style={{ fontSize: '0.65rem' }}>
                    MENTOR
                  </span>
                )}
              </div>
              <div className="text-muted small mb-1">{profile.occupation || 'Peer Learner'}</div>
              <div className="d-flex align-items-center gap-3 small text-muted">
                <StarRating rating={profile.averageRating || 5.0} totalReviews={profile.totalReviews || 0} size={14} />
                {profile.location && (
                  <span className="d-inline-flex align-items-center gap-1">
                    <MapPin size={13} /> {profile.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skill Exchange Dynamic Mapping */}
        <div className="col-lg-4">
          <div className="p-3 bg-light rounded-3 border">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>
                THEY TEACH YOU
              </span>
              <span className="badge bg-primary-subtle text-primary fw-bold" style={{ fontSize: '0.8rem' }}>
                {match.matchedWantedSkill ? match.matchedWantedSkill.name : (candidate.offeredSkills?.[0]?.skill?.name || 'Their Expertise')}
              </span>
            </div>

            <div className="text-center my-1 text-muted">
              <ArrowRightLeft size={16} color="#6366F1" />
            </div>

            <div className="d-flex align-items-center justify-content-between">
              <span className="small text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>
                YOU TEACH THEM
              </span>
              <span className="badge bg-indigo-subtle fw-bold" style={{ fontSize: '0.8rem' }}>
                {match.matchedOfferedSkill ? match.matchedOfferedSkill.name : 'Your Skills'}
              </span>
            </div>
          </div>
        </div>

        {/* Score & Action Column */}
        <div className="col-lg-3 text-lg-end">
          <div className="d-flex flex-column align-items-lg-end gap-2">
            <div className="d-inline-flex align-items-center gap-2">
              <span className={`match-score-pill ${score >= 90 ? 'match-score-high' : ''}`}>
                <Sparkles size={16} />
                {score}% Match
              </span>
              {match.isMutualMatch && (
                <span className="badge bg-success-subtle text-success border border-success-subtle small">
                  Mutual Match
                </span>
              )}
            </div>

            <button
              onClick={() => onProposeExchange(candidate, match)}
              className="btn btn-primary d-inline-flex align-items-center gap-2 mt-2 w-100 justify-content-center"
            >
              <Send size={16} />
              <span>Send Proposal</span>
            </button>

            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="btn btn-link btn-sm text-decoration-none text-muted p-0 d-inline-flex align-items-center gap-1"
              style={{ fontSize: '0.78rem' }}
            >
              <span>{showBreakdown ? 'Hide score logic' : 'Why this match score?'}</span>
              {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Transparent Match Score Logic Accordion */}
      {showBreakdown && (
        <div className="mt-3 pt-3 border-top bg-white p-3 rounded border">
          <h6 className="fw-bold small text-dark mb-2">Transparent Match Scoring Breakdown:</h6>
          <div className="row g-2 small text-muted">
            <div className="col-md-4">
              <span className="fw-semibold text-dark">Skill Complementarity:</span> {breakdown.skillComplementarity || 0} / 50 pts
            </div>
            <div className="col-md-4">
              <span className="fw-semibold text-dark">Experience Level:</span> {breakdown.experienceLevel || 0} / 15 pts
            </div>
            <div className="col-md-4">
              <span className="fw-semibold text-dark">Language Fit:</span> {breakdown.languageCompatibility || 0} / 15 pts
            </div>
            <div className="col-md-4">
              <span className="fw-semibold text-dark">Availability Overlap:</span> {breakdown.availabilityOverlap || 0} / 10 pts
            </div>
            <div className="col-md-4">
              <span className="fw-semibold text-dark">Rating & Track Record:</span> {breakdown.reputationAndRating || 0} / 10 pts
            </div>
            <div className="col-md-4">
              <span className="fw-bold text-primary">Total Calculated:</span> {score}% Compatibility
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
