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
  Calendar,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRightLeft
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
        <div className="container" style={{ maxWidth: '960px' }}>
          <LoadingSkeleton count={3} type="card" />
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
  const isMentor = targetUser.role === 'MENTOR' || profile.isMentor;

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Main Profile Header Card */}
        <div className="admin-card mb-4 overflow-hidden">
          {/* Cover Banner */}
          <div className="profile-cover-banner p-3 d-flex justify-content-between align-items-start">
            <span className="badge bg-white bg-opacity-90 backdrop-blur text-dark rounded-pill px-3 py-1.5 shadow-sm fw-semibold" style={{ fontSize: '0.74rem' }}>
              SkillBridge Community Member
            </span>

            {isSelf && (
              <Link
                to="/dashboard/profile"
                className="btn btn-sm btn-light bg-white bg-opacity-90 backdrop-blur rounded-pill px-3 py-1.5 shadow-sm fw-semibold"
                style={{ fontSize: '0.78rem' }}
              >
                Edit Your Profile
              </Link>
            )}
          </div>

          <div className="px-4 pb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-3">
              <div className="d-flex align-items-end gap-3">
                {/* Avatar with Verified Badge */}
                <div className="profile-avatar-wrapper position-relative">
                  <img
                    src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUser.username}`}
                    alt={profile.fullName || targetUser.username}
                    className="rounded-circle w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                  {isMentor && (
                    <span
                      className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1 shadow"
                      title="Verified Mentor"
                      style={{ display: 'flex', border: '2px solid #FFFFFF' }}
                    >
                      <CheckCircle size={16} />
                    </span>
                  )}
                </div>

                <div>
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                    <h3 className="fw-extrabold text-dark mb-0">
                      {profile.fullName || targetUser.username}
                    </h3>
                    {isMentor && (
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                        Verified Mentor
                      </span>
                    )}
                    <span className="badge bg-light text-secondary border rounded-pill px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                      {profile.experienceLevel || 'INTERMEDIATE'}
                    </span>
                  </div>

                  <div className="text-muted small mb-1">
                    {profile.occupation || 'Community Learner'} • @{targetUser.username}
                  </div>

                  <div className="d-flex flex-wrap align-items-center gap-3 text-muted small" style={{ fontSize: '0.8rem' }}>
                    <StarRating rating={profile.averageRating || 5.0} totalReviews={profile.totalReviews || 0} size={15} />
                    {profile.location && (
                      <span className="d-inline-flex align-items-center gap-1">
                        <MapPin size={14} className="text-primary" /> {profile.location}
                      </span>
                    )}
                    {profile.languages && (
                      <span className="d-inline-flex align-items-center gap-1">
                        <Globe size={14} className="text-secondary" /> {profile.languages}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {!isSelf ? (
                <div className="d-flex gap-2">
                  <button
                    onClick={handleStartChat}
                    className="btn btn-outline-primary rounded-pill px-3.5 py-2 d-inline-flex align-items-center gap-1.5 shadow-sm fw-semibold"
                  >
                    <MessageSquare size={16} />
                    <span>Send Message</span>
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-1.5 shadow-sm fw-semibold"
                  >
                    <Send size={16} />
                    <span>Propose Exchange</span>
                  </button>
                </div>
              ) : (
                <div className="text-muted small fst-italic">This is your public profile.</div>
              )}
            </div>

            {/* Social Links Strip */}
            {(profile.githubUrl || profile.linkedinUrl || profile.portfolioUrl || profile.twitterUrl) && (
              <div className="d-flex flex-wrap gap-2 pt-3 border-top">
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-light border rounded-pill d-inline-flex align-items-center gap-1.5"
                    style={{ fontSize: '0.76rem' }}
                  >
                    <Github size={13} />
                    <span>GitHub</span>
                    <ExternalLink size={10} className="text-muted" />
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-light border rounded-pill d-inline-flex align-items-center gap-1.5"
                    style={{ fontSize: '0.76rem' }}
                  >
                    <Linkedin size={13} color="#0A66C2" />
                    <span>LinkedIn</span>
                    <ExternalLink size={10} className="text-muted" />
                  </a>
                )}
                {profile.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-light border rounded-pill d-inline-flex align-items-center gap-1.5"
                    style={{ fontSize: '0.76rem' }}
                  >
                    <Globe size={13} color="#10B981" />
                    <span>Portfolio</span>
                    <ExternalLink size={10} className="text-muted" />
                  </a>
                )}
                {profile.twitterUrl && (
                  <a
                    href={profile.twitterUrl.startsWith('http') ? profile.twitterUrl : `https://twitter.com/${profile.twitterUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-light border rounded-pill d-inline-flex align-items-center gap-1.5"
                    style={{ fontSize: '0.76rem' }}
                  >
                    <Twitter size={13} color="#1DA1F2" />
                    <span>Twitter / X</span>
                    <ExternalLink size={10} className="text-muted" />
                  </a>
                )}
              </div>
            )}

            {/* About / Bio Section */}
            <div className="mt-3 pt-3 border-top">
              <h6 className="fw-bold text-dark mb-2">About & Background</h6>
              <p className="text-secondary small mb-3" style={{ lineHeight: 1.7, fontSize: '0.88rem' }}>
                {profile.bio || 'This user has not written a public bio yet.'}
              </p>

              {/* Mentor Philosophy if applicable */}
              {profile.mentorBio && (
                <div className="p-3 rounded-3 bg-primary-subtle border border-primary-subtle mb-3">
                  <div className="d-flex align-items-center gap-2 fw-bold text-primary small mb-1">
                    <Award size={15} /> Mentorship Approach
                  </div>
                  <p className="text-dark small mb-0" style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
                    "{profile.mentorBio}"
                  </p>
                </div>
              )}

              {profile.availability && (
                <div className="p-2.5 px-3 bg-light rounded-3 border text-secondary small d-inline-flex align-items-center gap-2">
                  <Calendar size={15} color="#2563EB" />
                  <span>
                    <strong className="text-dark">Availability Window:</strong> {profile.availability}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Two-Column Grid */}
        <div className="row g-4 mb-4">
          {/* Skills They Can Teach */}
          <div className="col-md-6">
            <div className="admin-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <GraduationCap size={18} />
                  </div>
                  <h5 className="fw-bold text-dark mb-0">Skills They Can Teach</h5>
                </div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1">
                  {(targetUser.offeredSkills || []).length} Skills
                </span>
              </div>

              <div className="d-flex flex-column gap-2.5">
                {(targetUser.offeredSkills || []).map((os) => (
                  <div key={os.id || os.skillId} className="profile-skill-card">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark">{os.skill?.name}</span>
                      <div className="d-flex gap-1.5">
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle" style={{ fontSize: '0.68rem' }}>
                          {os.proficiencyLevel}
                        </span>
                        <span className="badge bg-light text-muted border" style={{ fontSize: '0.68rem' }}>
                          {os.yearsOfExperience} yr{os.yearsOfExperience === 1 ? '' : 's'} exp
                        </span>
                      </div>
                    </div>
                    {os.description && (
                      <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
                        "{os.description}"
                      </p>
                    )}
                  </div>
                ))}
                {(!targetUser.offeredSkills || targetUser.offeredSkills.length === 0) && (
                  <div className="text-muted small text-center py-4 border rounded-3 border-dashed">
                    No teaching skills listed yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills They Want to Learn */}
          <div className="col-md-6">
            <div className="admin-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#EEF2FF',
                      color: '#6366F1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Sparkles size={18} />
                  </div>
                  <h5 className="fw-bold text-dark mb-0">Skills They Want to Learn</h5>
                </div>
                <span className="badge bg-indigo-subtle text-indigo border rounded-pill px-2.5 py-1" style={{ color: '#4F46E5', backgroundColor: '#EEF2FF' }}>
                  {(targetUser.wantedSkills || []).length} Goals
                </span>
              </div>

              <div className="d-flex flex-column gap-2.5">
                {(targetUser.wantedSkills || []).map((ws) => (
                  <div key={ws.id || ws.skillId} className="profile-skill-card">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark">{ws.skill?.name}</span>
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: ws.priority === 'HIGH' ? '#FEE2E2' : '#EFF6FF',
                          color: ws.priority === 'HIGH' ? '#B91C1C' : '#1D4ED8',
                          fontSize: '0.68rem'
                        }}
                      >
                        {ws.priority} Priority
                      </span>
                    </div>
                    {ws.goals && (
                      <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
                        Goal: "{ws.goals}"
                      </p>
                    )}
                  </div>
                ))}
                {(!targetUser.wantedSkills || targetUser.wantedSkills.length === 0) && (
                  <div className="text-muted small text-center py-4 border rounded-3 border-dashed">
                    No learning wishes listed yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Received Card */}
        <div className="admin-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Star size={18} fill="#D97706" />
              </div>
              <h5 className="fw-bold text-dark mb-0">Verified Reviews & Endorsements</h5>
            </div>
            <span className="badge bg-light text-secondary border rounded-pill px-2.5 py-1">
              {(targetUser.reviewsReceived || []).length} Reviews
            </span>
          </div>

          {(!targetUser.reviewsReceived || targetUser.reviewsReceived.length === 0) ? (
            <div className="text-center text-muted small py-4 border rounded-3 border-dashed">
              No reviews yet. Complete a learning exchange to earn the first verified community endorsement!
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {targetUser.reviewsReceived.map((r) => (
                <div key={r.id} className="p-3 rounded-3 border bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold text-dark small">{r.reviewer?.profile?.fullName || r.reviewer?.username}</span>
                      <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.68rem' }}>
                        Verified Exchange
                      </span>
                    </div>
                    <StarRating rating={r.rating} size={13} />
                  </div>
                  <p className="text-secondary small mb-0" style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
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
