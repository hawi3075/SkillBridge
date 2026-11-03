import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { exchangeApi, sessionApi, reviewApi } from '../../services/api';
import ExchangeCard from '../../components/cards/ExchangeCard';
import SessionCard from '../../components/cards/SessionCard';
import StarRating from '../../components/common/StarRating';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { GraduationCap, Users, Calendar, Award, CheckCircle2, Clock } from 'lucide-react';

export const MentorDashboardPage = () => {
  const { user } = useAuth();
  const profile = user?.profile || {};

  const [studentRequests, setStudentRequests] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentorData();
  }, [user]);

  const fetchMentorData = async () => {
    try {
      setLoading(true);
      const [exRes, sessRes, revRes] = await Promise.all([
        exchangeApi.getExchanges({ type: 'received' }),
        sessionApi.getSessions({ status: 'SCHEDULED' }),
        reviewApi.getUserReviews(user.id)
      ]);

      if (exRes.success) setStudentRequests(exRes.data || []);
      if (sessRes.success) setUpcomingSessions(sessRes.data || []);
      if (revRes.success) setReviews(revRes.data || []);
    } catch (err) {
      console.error('Error fetching mentor portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingRequests = studentRequests.filter(r => r.status === 'PENDING');

  return (
    <div className="py-4">
      {/* Mentor Header Card */}
      <div className="sb-card p-4 p-md-5 bg-white mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-4">
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <GraduationCap size={32} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h3 className="fw-extrabold text-dark mb-0">Mentor Hub</h3>
                <span className="badge bg-primary text-white">Active Mentor</span>
              </div>
              <p className="text-muted small mb-0">
                Track your teaching sessions, incoming student requests, and student reviews.
              </p>
            </div>
          </div>

          <div className="d-flex gap-3 text-center">
            <div className="p-3 bg-light rounded-3 border">
              <div className="fw-bolder fs-4 text-dark">{profile.completedExchanges || 0}</div>
              <div className="text-muted small" style={{ fontSize: '0.72rem' }}>SESSIONS TAUGHT</div>
            </div>
            <div className="p-3 bg-light rounded-3 border">
              <div className="fw-bolder fs-4 text-warning">
                {Number(profile.averageRating || 5.0).toFixed(1)}
              </div>
              <div className="text-muted small" style={{ fontSize: '0.72rem' }}>MENTOR RATING</div>
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Student Requests */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-dark mb-0">Incoming Student Proposals ({pendingRequests.length})</h5>
        </div>

        {loading ? (
          <LoadingSkeleton count={2} type="table" />
        ) : pendingRequests.length === 0 ? (
          <div className="sb-card p-4 text-center bg-white">
            <p className="text-muted small mb-0">
              No pending student requests. Learners interested in your teaching skills will appear here.
            </p>
          </div>
        ) : (
          pendingRequests.map(req => (
            <div key={req.id} className="sb-card p-4 bg-white mb-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="fw-bold text-dark mb-1">
                    Proposal from {req.sender?.profile?.fullName || req.sender?.username}
                  </h6>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle small">
                    Wants to Learn: {req.wantedSkill?.name}
                  </span>
                </div>
                <span className="badge bg-warning-subtle text-warning-emphasis">Pending Your Decision</span>
              </div>
              <p className="text-dark small my-2">"{req.message}"</p>
              <div className="text-muted small">Proposed Window: {req.proposedSchedule}</div>
            </div>
          ))
        )}
      </div>

      {/* Upcoming Mentorship Sessions */}
      <div className="mb-4">
        <h5 className="fw-bold text-dark mb-3">Upcoming Teaching Sessions ({upcomingSessions.length})</h5>
        {upcomingSessions.length === 0 ? (
          <div className="sb-card p-4 text-center bg-white">
            <p className="text-muted small mb-0">No upcoming video sessions scheduled right now.</p>
          </div>
        ) : (
          upcomingSessions.map(s => (
            <SessionCard
              key={s.id}
              session={s}
              currentUserId={user?.id}
              onUpdateStatus={() => fetchMentorData()}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MentorDashboardPage;
