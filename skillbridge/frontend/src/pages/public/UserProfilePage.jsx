import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userApi, chatApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StarRating from '../../components/common/StarRating';
import ProposeExchangeModal from '../../components/forms/ProposeExchangeModal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Send,
  MessageSquare,
  Globe,
  Star,
  CheckCircle,
  Calendar
} from 'lucide-react';

export const UserProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await userApi.getUserById(id);
        if (res.success) {
          setTargetUser(res.data);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to chat with users', 'info');
      return;
    }
    try {
      const res = await chatApi.startDirect(targetUser.id);
      if (res.success) {
        window.location.href = `/dashboard/messages?conversationId=${res.data.id}`;
      }
    } catch (err) {
      showToast('Could not start chat conversation', 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-5 bg-light min-vh-100">
        <div className="container" style={{ maxWidth: '900px' }}>
          <LoadingSkeleton count={2} type="card" />
        </div>
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div className="py-5 bg-light min-vh-100">
        <div className="container" style={{ maxWidth: '600px' }}>
          <EmptyState
            title="User Profile Not Found"
            description="The requested user account may have been modified or deleted."
            actionLabel="Browse Mentors"
            actionLink="/mentors"
          />
        </div>
      </div>
    );
  }

  const profile = targetUser.profile || {};
  const isSelf = currentUser?.id === targetUser.id;

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Main Profile Header Card */}
        <div className="sb-card p-4 p-md-5 bg-white mb-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-4">
            <div className="d-flex align-items-center gap-4">
              <div className="position-relative">
                <img
                  src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUser.username}`}
                  alt={profile.fullName || targetUser.username}
                  className="rounded-circle border"
                  style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                />
                {targetUser.role === 'MENTOR' && (
                  <span
                    className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1"
                    title="Verified Mentor"
                    style={{ display: 'flex' }}
                  >
                    <CheckCircle size={18} />
                  </span>
                )}
              </div>

              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h3 className="fw-extrabold text-dark mb-0">{profile.fullName || targetUser.username}</h3>
                  <span className="badge bg-light text-secondary border small">
                    {profile.experienceLevel || 'INTERMEDIATE'}
                  </span>
                </div>

                <div className="text-muted small mb-2">
                  {profile.occupation || 'Peer Learner'} • @{targetUser.username}
                </div>

                <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
                  <StarRating rating={profile.averageRating || 5.0} totalReviews={profile.totalReviews || 0} size={15} />
                  {profile.location && (
                    <span className="d-inline-flex align-items-center gap-1">
                      <MapPin size={14} /> {profile.location}
                    </span>
                  )}
                  {profile.languages && (
                    <span className="d-inline-flex align-items-center gap-1">
                      🗣️ {profile.languages}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {!isSelf && (
              <div className="d-flex gap-2">
                <button
                  onClick={handleStartChat}
                  className="btn btn-outline-primary d-inline-flex align-items-center gap-1"
                >
                  <MessageSquare size={16} />
                  <span>Chat</span>
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-primary d-inline-flex align-items-center gap-1"
                >
                  <Send size={16} />
                  <span>Propose Exchange</span>
                </button>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="mt-4 pt-4 border-top">
            <h6 className="fw-bold text-dark mb-2">About</h6>
            <p className="text-dark small mb-3" style={{ lineHeight: 1.7 }}>
              {profile.bio || 'This user has not written a personal bio yet.'}
            </p>

            {profile.availability && (
              <div className="p-3 bg-light rounded-3 text-muted small d-flex align-items-center gap-2">
                <Calendar size={16} color="#2563EB" />
                <span>
                  <strong>Availability:</strong> {profile.availability}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Skills Two-Column Grid */}
        <div className="row g-4 mb-4">
          {/* Can Teach */}
          <div className="col-md-6">
            <div className="sb-card p-4 bg-white h-100">
              <h5 className="fw-bold text-dark mb-3">Skills They Can Teach</h5>
              <div className="d-flex flex-column gap-2">
                {(targetUser.offeredSkills || []).map((os) => (
                  <div key={os.id || os.skillId} className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small text-primary">{os.skill?.name}</span>
                      <span className="badge bg-white text-muted border small">{os.proficiencyLevel}</span>
                    </div>
                    {os.description && (
                      <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
                        {os.description}
                      </p>
                    )}
                  </div>
                ))}
                {(!targetUser.offeredSkills || targetUser.offeredSkills.length === 0) && (
                  <div className="text-muted small text-center py-3">No skills listed yet.</div>
                )}
              </div>
            </div>
          </div>

          {/* Wants to Learn */}
          <div className="col-md-6">
            <div className="sb-card p-4 bg-white h-100">
              <h5 className="fw-bold text-dark mb-3">Skills They Want to Learn</h5>
              <div className="d-flex flex-column gap-2">
                {(targetUser.wantedSkills || []).map((ws) => (
                  <div key={ws.id || ws.skillId} className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small text-indigo" style={{ color: '#6366F1' }}>
                        {ws.skill?.name}
                      </span>
                      <span className="badge bg-white text-muted border small">{ws.priority} Priority</span>
                    </div>
                    {ws.goals && (
                      <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
                        Goals: {ws.goals}
                      </p>
                    )}
                  </div>
                ))}
                {(!targetUser.wantedSkills || targetUser.wantedSkills.length === 0) && (
                  <div className="text-muted small text-center py-3">No learning wishes listed yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Received */}
        <div className="sb-card p-4 bg-white">
          <h5 className="fw-bold text-dark mb-3">Peer Reviews & Endorsements</h5>
          {(!targetUser.reviewsReceived || targetUser.reviewsReceived.length === 0) ? (
            <div className="text-center text-muted small py-3">
              No reviews yet. Complete a learning exchange to leave the first review!
            </div>
          ) : (
            targetUser.reviewsReceived.map((r) => (
              <div key={r.id} className="p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold small text-dark">{r.reviewer?.profile?.fullName || r.reviewer?.username}</span>
                  <StarRating rating={r.rating} size={13} />
                </div>
                <p className="text-dark small mb-0">"{r.comment}"</p>
              </div>
            ))
          )}
        </div>

        {/* Proposal Modal */}
        {targetUser && (
          <ProposeExchangeModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            candidate={targetUser}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
