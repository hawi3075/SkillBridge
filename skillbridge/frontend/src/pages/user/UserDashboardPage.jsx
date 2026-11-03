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
  Award
} from 'lucide-react';

export const UserDashboardPage = () => {
  const { user } = useAuth();
  const profile = user?.profile || {};

  const [matches, setMatches] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Proposal modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [matchRes, exRes, sessRes] = await Promise.all([
          matchApi.getMatches(),
          exchangeApi.getExchanges({ limit: 5 }),
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

    fetchDashboardData();
  }, []);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let score = 20; // base account
    if (profile.fullName) score += 15;
    if (profile.bio && profile.bio.length > 20) score += 15;
    if (profile.location) score += 10;
    if (profile.education || profile.occupation) score += 10;
    if (user?.offeredSkills && user.offeredSkills.length > 0) score += 15;
    if (user?.wantedSkills && user.wantedSkills.length > 0) score += 15;
    return Math.min(100, score);
  };

  const completionRate = calculateProfileCompletion();

  const handlePropose = (candidate, match) => {
    setSelectedCandidate(candidate);
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const pendingExchangesCount = exchanges.filter(e => e.status === 'PENDING').length;
  const activeExchangesCount = exchanges.filter(e => ['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS'].includes(e.status)).length;
  const completedExchangesCount = profile.completedExchanges || 0;

  return (
    <div>
      {/* Welcome & Banner */}
      <div className="sb-card p-4 p-md-5 bg-white mb-4 position-relative overflow-hidden">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">
              Peer Learning Portal
            </span>
            <h2 className="fw-extrabold text-dark mb-2">
              Welcome back, {profile.fullName || user?.username}! 👋
            </h2>
            <p className="text-muted mb-4" style={{ maxWidth: '520px', lineHeight: 1.6 }}>
              You have <strong>{pendingExchangesCount}</strong> pending exchange requests and <strong>{sessions.length}</strong> upcoming learning sessions scheduled.
            </p>

            <div className="d-flex flex-wrap gap-2">
              <Link to="/dashboard/matches" className="btn btn-primary d-inline-flex align-items-center gap-2">
                <Sparkles size={16} />
                <span>Find Compatible Matches</span>
              </Link>
              <Link to="/dashboard/profile" className="btn btn-outline-secondary">
                Manage My Skills
              </Link>
            </div>
          </div>

          {/* Profile Progress Card */}
          <div className="col-lg-4">
            <div className="p-3 bg-light rounded-3 border">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small fw-bold text-dark">Profile Strength</span>
                <span className="badge bg-primary">{completionRate}%</span>
              </div>
              <div className="progress mb-2" style={{ height: '8px' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
                {completionRate < 100 ? (
                  <Link to="/dashboard/profile" className="text-decoration-none">
                    Complete your skills and bio to get higher quality match suggestions!
                  </Link>
                ) : (
                  'All profile information fully optimized!'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real Statistics Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="sb-card p-3 bg-white text-center">
            <div className="text-muted small mb-1 fw-semibold">SKILLS OFFERED</div>
            <h3 className="fw-extrabold text-primary mb-0">{user?.offeredSkills?.length || 0}</h3>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="sb-card p-3 bg-white text-center">
            <div className="text-muted small mb-1 fw-semibold">SKILLS WANTED</div>
            <h3 className="fw-extrabold text-indigo mb-0" style={{ color: '#6366F1' }}>
              {user?.wantedSkills?.length || 0}
            </h3>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="sb-card p-3 bg-white text-center">
            <div className="text-muted small mb-1 fw-semibold">ACTIVE EXCHANGES</div>
            <h3 className="fw-extrabold text-success mb-0">{activeExchangesCount}</h3>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="sb-card p-3 bg-white text-center">
            <div className="text-muted small mb-1 fw-semibold">AVERAGE RATING</div>
            <div className="d-flex align-items-center justify-content-center gap-1">
              <Star size={18} fill="#F59E0B" color="#F59E0B" />
              <h3 className="fw-extrabold text-dark mb-0">
                {Number(profile.averageRating || 5.0).toFixed(1)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Top Recommended Matches Carousel/List */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold text-dark mb-0">Recommended Skill Exchange Matches</h5>
          <span className="text-muted small">Generated by transparent compatibility analysis</span>
        </div>
        <Link to="/dashboard/matches" className="btn btn-sm btn-link text-decoration-none fw-semibold">
          View all matches &rarr;
        </Link>
      </div>

      {loading ? (
        <LoadingSkeleton count={2} type="card" />
      ) : matches.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No compatible matches yet"
          description="Add more skills to your teaching inventory and learning wishlist to enable our matching engine to identify mutual peers!"
          actionLabel="Add Skills Now"
          actionLink="/dashboard/profile"
        />
      ) : (
        matches.slice(0, 3).map((match, idx) => (
          <MatchCard key={idx} match={match} onProposeExchange={handlePropose} />
        ))
      )}

      {/* Proposal Modal */}
      {selectedCandidate && (
        <ProposeExchangeModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedCandidate(null); }}
          candidate={selectedCandidate}
          initialMatch={selectedMatch}
          onSuccess={() => {
            // refresh data
          }}
        />
      )}
    </div>
  );
};

export default UserDashboardPage;
