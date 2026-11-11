import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { matchApi, exchangeApi, sessionApi } from '../../services/api';
import MatchCard from '../../components/cards/MatchCard';
import ProposeExchangeModal from '../../components/forms/ProposeExchangeModal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  Sparkles,
  ArrowRightLeft,
  Calendar,
  BookOpen,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Check,
  AlertCircle,
  MessageSquare,
  Video,
  ShieldCheck,
  Compass,
  Users,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';

export const UserDashboardPage = () => {
  const { user, isMentor } = useAuth();
  const profile = user?.profile || {};

  const [matches, setMatches] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mutualOnly, setMutualOnly] = useState(false);

  // Proposal modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [matchRes, exRes, sessRes] = await Promise.all([
        matchApi.getMatches(),
        exchangeApi.getExchanges({ limit: 6 }),
        sessionApi.getSessions({ status: 'SCHEDULED' })
      ]);

      if (matchRes.success) setMatches(matchRes.data || []);
      if (exRes.success) setExchanges(exRes.data || []);
      if (sessRes.success) setSessions(sessRes.data || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Profile completion calculation & checklist
  const profileSteps = [
    { label: 'Basic Account Created', done: true },
    { label: 'Full Name & Biography', done: Boolean(profile.fullName && profile.bio && profile.bio.length > 15) },
    { label: 'Skills to Teach (Offering)', done: Boolean(user?.offeredSkills && user.offeredSkills.length > 0) },
    { label: 'Skills to Learn (Wishlist)', done: Boolean(user?.wantedSkills && user.wantedSkills.length > 0) },
    { label: 'Location & Timezone', done: Boolean(profile.location) }
  ];

  const completedStepsCount = profileSteps.filter(s => s.done).length;
  const completionRate = Math.round((completedStepsCount / profileSteps.length) * 100);

  const handlePropose = (candidate, match) => {
    setSelectedCandidate(candidate);
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const pendingExchanges = exchanges.filter(e => e.status === 'PENDING');
  const activeExchanges = exchanges.filter(e => ['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS'].includes(e.status));
  const completedExchangesCount = profile.completedExchanges || exchanges.filter(e => e.status === 'COMPLETED').length;

  const filteredMatches = mutualOnly ? matches.filter(m => m.isMutualMatch) : matches;

  return (
    <div>
      {/* 1. Executive Welcome Banner */}
      <div className="dashboard-welcome-banner p-4 p-md-5 mb-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                ⚡ PEER LEARNING PORTAL
              </span>
              <div className="admin-system-chip">
                <span className="pulse-dot"></span>
                <span>Neon PostgreSQL Active</span>
              </div>
              {isMentor && (
                <span className="badge bg-indigo-subtle border px-2.5 py-1 rounded-pill" style={{ fontSize: '0.72rem' }}>
                  🎓 Verified Mentor
                </span>
              )}
            </div>

            <h2 className="fw-extrabold text-dark mb-2" style={{ letterSpacing: '-0.03em' }}>
              {getGreeting()}, {profile.fullName || user?.username}! 👋
            </h2>
            <p className="text-muted mb-4" style={{ maxWidth: '560px', lineHeight: 1.6, fontSize: '0.98rem' }}>
              Welcome to your personal command center. You have <strong>{pendingExchanges.length}</strong> pending exchange request{pendingExchanges.length === 1 ? '' : 's'} and <strong>{sessions.length}</strong> upcoming 1-on-1 session{sessions.length === 1 ? '' : 's'} scheduled.
            </p>

            {/* Quick Navigation Action Pills */}
            <div className="d-flex flex-wrap align-items-center gap-2">
              <Link
                to="/dashboard/matches"
                className="btn btn-primary rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 shadow-sm"
                style={{ fontWeight: 600, fontSize: '0.88rem' }}
              >
                <Sparkles size={16} />
                <span>Find Peer Matches</span>
              </Link>
              <Link
                to="/mentors"
                className="btn btn-light rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 border bg-white shadow-sm hover-lift"
                style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0F172A' }}
              >
                <Compass size={16} color="#2563EB" />
                <span>Explore Mentors</span>
              </Link>
              <Link
                to="/dashboard/profile"
                className="btn btn-light rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 border bg-white shadow-sm hover-lift"
                style={{ fontWeight: 600, fontSize: '0.88rem', color: '#475569' }}
              >
                <Layers size={16} />
                <span>My Skill Inventory</span>
              </Link>
            </div>
          </div>

          {/* Profile Progress Card */}
          <div className="col-lg-4">
            <div className="sb-card p-3 p-md-4 bg-white shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small fw-bold text-dark d-flex align-items-center gap-1.5">
                  <ShieldCheck size={16} color="#10B981" /> Profile Strength
                </span>
                <span className="badge bg-primary fw-bold" style={{ fontSize: '0.75rem' }}>{completionRate}%</span>
              </div>
              <div className="progress mb-2.5" style={{ height: '7px', backgroundColor: '#F1F5F9' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${completionRate}%`,
                    background: 'linear-gradient(90deg, #2563EB 0%, #6366F1 100%)',
                    borderRadius: '9999px'
                  }}
                ></div>
              </div>
              <p className="text-muted small mb-0" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                {completionRate < 100 ? (
                  <Link to="/dashboard/profile" className="text-decoration-none fw-semibold text-primary d-inline-flex align-items-center gap-1">
                    <span>Complete {profileSteps.length - completedStepsCount} more step{profileSteps.length - completedStepsCount === 1 ? '' : 's'} for 100% match accuracy</span>
                    <ArrowRight size={12} />
                  </Link>
                ) : (
                  <span className="text-success fw-medium d-inline-flex align-items-center gap-1">
                    <CheckCircle2 size={13} /> Your learning profile is fully optimized!
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Attention Alert: Pending Proposals */}
      {pendingExchanges.length > 0 && (
        <div className="alert bg-white border border-warning shadow-sm rounded-4 p-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#FEF3C7',
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertCircle size={22} />
            </div>
            <div>
              <div className="fw-bold text-dark mb-0.5">
                {pendingExchanges.length} Pending Skill Exchange Proposal{pendingExchanges.length === 1 ? '' : 's'}
              </div>
              <span className="text-muted small">
                A fellow learner proposed a skill trade. Accept to start 1-on-1 learning sessions.
              </span>
            </div>
          </div>
          <Link to="/dashboard/exchanges" className="btn btn-sm btn-primary rounded-pill px-3">
            Review Proposals &rarr;
          </Link>
        </div>
      )}

      {/* 3. Executive KPI Stat Cards */}
      <div className="row g-3 mb-4">
        {/* Skills Offered */}
        <div className="col-sm-6 col-lg-3">
          <div className="admin-kpi-card kpi-blue h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                CAN TEACH
              </span>
              <div className="admin-kpi-icon" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                <BookOpen size={20} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h2 className="fw-extrabold text-dark mb-0" style={{ letterSpacing: '-0.03em' }}>
                {user?.offeredSkills?.length || 0}
              </h2>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill" style={{ fontSize: '0.68rem' }}>
                Active Topics
              </span>
            </div>
            <div className="text-muted small" style={{ fontSize: '0.76rem' }}>
              Skills in your teaching inventory
            </div>
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="col-sm-6 col-lg-3">
          <div className="admin-kpi-card kpi-indigo h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                WANT TO LEARN
              </span>
              <div className="admin-kpi-icon" style={{ backgroundColor: '#EEF2FF', color: '#6366F1' }}>
                <Zap size={20} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h2 className="fw-extrabold text-dark mb-0" style={{ letterSpacing: '-0.03em' }}>
                {user?.wantedSkills?.length || 0}
              </h2>
              <span className="badge bg-indigo-subtle border rounded-pill" style={{ fontSize: '0.68rem' }}>
                Wishlist
              </span>
            </div>
            <div className="text-muted small" style={{ fontSize: '0.76rem' }}>
              Topics you are aiming to master
            </div>
          </div>
        </div>

        {/* Active Exchanges */}
        <div className="col-sm-6 col-lg-3">
          <div className="admin-kpi-card kpi-emerald h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                EXCHANGES
              </span>
              <div className="admin-kpi-icon" style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}>
                <ArrowRightLeft size={20} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h2 className="fw-extrabold text-dark mb-0" style={{ letterSpacing: '-0.03em' }}>
                {activeExchanges.length}
              </h2>
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{ fontSize: '0.68rem' }}>
                {completedExchangesCount} Completed
              </span>
            </div>
            <div className="text-muted small" style={{ fontSize: '0.76rem' }}>
              Active 1-on-1 reciprocal trades
            </div>
          </div>
        </div>

        {/* Reputation Rating */}
        <div className="col-sm-6 col-lg-3">
          <div className="admin-kpi-card kpi-amber h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                REPUTATION
              </span>
              <div className="admin-kpi-icon" style={{ backgroundColor: '#FEF3C7', color: '#F59E0B' }}>
                <Star size={20} fill="#F59E0B" />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h2 className="fw-extrabold text-dark mb-0" style={{ letterSpacing: '-0.03em' }}>
                {Number(profile.averageRating || 5.0).toFixed(1)}
              </h2>
              <span className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill" style={{ fontSize: '0.68rem' }}>
                {profile.totalReviews || 0} Reviews
              </span>
            </div>
            <div className="text-muted small" style={{ fontSize: '0.76rem' }}>
              Verified community rating
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Two-Column Layout */}
      <div className="row g-4">
        {/* Left Column: Recommended Matches & Quick Exchanges */}
        <div className="col-lg-8">
          {/* Section Header with Filter Switch */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <Sparkles size={18} color="#2563EB" />
                <span>Recommended Skill Matches</span>
              </h5>
              <span className="text-muted small">Generated by algorithm analyzing your skill complementarity</span>
            </div>

            <div className="d-flex align-items-center gap-2 bg-white px-3 py-1.5 rounded-pill border shadow-sm">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="dashboardMutualOnly"
                  checked={mutualOnly}
                  onChange={(e) => setMutualOnly(e.target.checked)}
                />
                <label className="form-check-label small fw-semibold text-dark" htmlFor="dashboardMutualOnly">
                  Mutual Only
                </label>
              </div>
            </div>
          </div>

          {/* Matches List */}
          {loading ? (
            <LoadingSkeleton count={2} type="card" />
          ) : filteredMatches.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No compatible matches yet"
              description="Add more skills to your teaching inventory and learning wishlist so the matching engine can find peers with reciprocal interests!"
              actionLabel="Add Skills Now"
              actionLink="/dashboard/profile"
            />
          ) : (
            <div className="d-flex flex-column gap-3 mb-4">
              {filteredMatches.slice(0, 3).map((match, idx) => (
                <MatchCard key={idx} match={match} onProposeExchange={handlePropose} />
              ))}
              {filteredMatches.length > 3 && (
                <div className="text-center pt-1">
                  <Link to="/dashboard/matches" className="btn btn-outline-primary btn-sm rounded-pill px-4">
                    View All {filteredMatches.length} Matches &rarr;
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Active Exchanges Snapshot */}
          {activeExchanges.length > 0 && (
            <div className="mt-4 pt-2">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <ArrowRightLeft size={16} color="#10B981" />
                  <span>Ongoing Exchanges ({activeExchanges.length})</span>
                </h6>
                <Link to="/dashboard/exchanges" className="small text-decoration-none fw-semibold">
                  Manage &rarr;
                </Link>
              </div>

              <div className="d-flex flex-column gap-2">
                {activeExchanges.slice(0, 3).map(e => {
                  const isSender = e.senderId === user?.id;
                  const partner = isSender ? e.receiver : e.sender;
                  const partnerProfile = partner?.profile || {};
                  return (
                    <div key={e.id} className="sb-card p-3 bg-white d-flex align-items-center justify-content-between gap-3">
                      <div className="d-flex align-items-center gap-2.5 overflow-hidden">
                        <img
                          src={partnerProfile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.username}`}
                          alt={partnerProfile.fullName || partner?.username}
                          className="rounded-circle border flex-shrink-0"
                          style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                        />
                        <div className="overflow-hidden">
                          <div className="fw-bold small text-dark text-truncate">
                            {partnerProfile.fullName || partner?.username}
                          </div>
                          <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                            Teaching {e.offeredSkill?.name} • Learning {e.wantedSkill?.name}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2 flex-shrink-0">
                        <Link to={`/dashboard/messages?conversationId=${e.id}`} className="btn btn-xs btn-outline-primary py-1 px-2.5 rounded-pill" style={{ fontSize: '0.75rem' }}>
                          <MessageSquare size={13} className="me-1" /> Chat
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Sessions & Readiness Checklist */}
        <div className="col-lg-4">
          {/* Upcoming Learning Sessions Widget */}
          <div className="sb-card p-4 bg-white mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <Calendar size={16} color="#2563EB" />
                <span>Upcoming Sessions</span>
              </h6>
              <Link to="/dashboard/sessions" className="small text-decoration-none fw-semibold">
                View all
              </Link>
            </div>

            {sessions.length === 0 ? (
              <div className="p-3 text-center bg-light rounded-3 border text-muted small">
                <Calendar size={28} className="text-muted mb-2 opacity-50" />
                <div>No sessions currently scheduled.</div>
                <Link to="/dashboard/exchanges" className="btn btn-xs btn-outline-primary rounded-pill mt-2 py-1 px-2.5" style={{ fontSize: '0.75rem' }}>
                  Schedule from Exchanges
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2.5">
                {sessions.slice(0, 3).map(s => {
                  const partner = s.hostId === user?.id ? s.attendee : s.host;
                  const partnerProfile = partner?.profile || {};
                  const startTime = new Date(s.startTime);
                  return (
                    <div key={s.id} className="p-3 bg-light rounded-3 border">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="fw-bold text-dark small">{s.title}</span>
                        <span className="status-badge status-scheduled" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                          Live Jitsi
                        </span>
                      </div>
                      <div className="text-muted small mb-2" style={{ fontSize: '0.75rem' }}>
                        With {partnerProfile.fullName || partner?.username} • {startTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <a
                        href={s.meetingUrl || `https://meet.jit.si/skillbridge-${s.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-xs btn-primary w-100 py-1 d-inline-flex align-items-center justify-content-center gap-1.5 rounded-pill"
                        style={{ fontSize: '0.76rem', fontWeight: 600 }}
                      >
                        <Video size={13} />
                        <span>Join Meeting Room</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Profile Optimization Checklist */}
          <div className="sb-card p-4 bg-white mb-4">
            <h6 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
              <CheckCircle2 size={16} color="#10B981" />
              <span>Readiness Checklist</span>
            </h6>
            <p className="text-muted small mb-3" style={{ fontSize: '0.76rem' }}>
              Complete these steps to maximize your platform matching score
            </p>

            <div className="d-flex flex-column gap-2">
              {profileSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="d-flex align-items-center justify-content-between p-2 rounded-2"
                  style={{
                    backgroundColor: step.done ? '#F8FAFC' : '#EFF6FF',
                    border: `1px solid ${step.done ? '#E2E8F0' : '#BFDBFE'}`
                  }}
                >
                  <span className={`small ${step.done ? 'text-muted text-decoration-line-through' : 'text-dark fw-semibold'}`} style={{ fontSize: '0.8rem' }}>
                    {step.label}
                  </span>
                  {step.done ? (
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{ fontSize: '0.65rem' }}>
                      <Check size={11} /> Done
                    </span>
                  ) : (
                    <Link to="/dashboard/profile" className="badge bg-primary rounded-pill text-decoration-none" style={{ fontSize: '0.65rem' }}>
                      Add &rarr;
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Community Tips Card */}
          <div className="p-3 bg-light rounded-4 border">
            <div className="d-flex align-items-center gap-2 mb-1.5 text-primary fw-bold small">
              <Zap size={14} />
              <span>Peer Learning Pro-Tip</span>
            </div>
            <p className="text-muted small mb-0" style={{ fontSize: '0.76rem', lineHeight: 1.5 }}>
              Prepare 2–3 concrete goals or questions before each video exchange session. Structured 45-minute practice sprints yield 3x higher retention than passive lectures!
            </p>
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {selectedCandidate && (
        <ProposeExchangeModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedCandidate(null); }}
          candidate={selectedCandidate}
          initialMatch={selectedMatch}
          onSuccess={() => {
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
};

export default UserDashboardPage;