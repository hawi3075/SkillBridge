import React, { useState, useEffect } from 'react';
import { sessionApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import SessionCard from '../../components/cards/SessionCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Calendar, Clock, Video, AlertCircle } from 'lucide-react';

export const SessionsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('UPCOMING');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await sessionApi.getSessions();
      if (res.success) {
        setSessions(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await sessionApi.updateSession(id, { status });
      if (res.success) {
        showToast(`Session marked as ${status.toLowerCase()}`, 'success');
        fetchSessions();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update session', 'error');
    }
  };

  const filtered = sessions.filter(s => {
    if (filter === 'UPCOMING') return s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS';
    if (filter === 'COMPLETED') return s.status === 'COMPLETED';
    if (filter === 'CANCELLED') return s.status === 'CANCELLED';
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Learning Sessions</h4>
          <span className="text-muted small">
            Live video sessions scheduled with your exchange partners. Displayed in your local timezone.
          </span>
        </div>

        {/* Filter Pills */}
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className={`sb-tab-pill ${filter === 'UPCOMING' ? 'active' : ''}`}
            onClick={() => setFilter('UPCOMING')}
          >
            Upcoming ({sessions.filter(s => ['SCHEDULED', 'IN_PROGRESS'].includes(s.status)).length})
          </button>
          <button
            type="button"
            className={`sb-tab-pill ${filter === 'COMPLETED' ? 'active' : ''}`}
            onClick={() => setFilter('COMPLETED')}
          >
            Completed ({sessions.filter(s => s.status === 'COMPLETED').length})
          </button>
          <button
            type="button"
            className={`sb-tab-pill ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All Sessions ({sessions.length})
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="alert alert-info d-flex align-items-center gap-2 small p-3 mb-4 rounded-3 border">
        <Video size={18} className="flex-shrink-0" />
        <div>
          Each session includes a free, direct <strong>Jitsi Meet</strong> room. Click "Join Meeting Room" at your scheduled time to connect instantly without installing extra software.
        </div>
      </div>

      {/* Sessions List */}
      {loading ? (
        <LoadingSkeleton count={3} type="table" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={filter === 'UPCOMING' ? 'No upcoming sessions scheduled' : 'No sessions found'}
          description="You can schedule a session once an exchange proposal has been accepted by either participant."
          actionLabel="View Active Exchanges"
          actionLink="/dashboard/exchanges"
        />
      ) : (
        filtered.map(s => (
          <SessionCard
            key={s.id}
            session={s}
            currentUserId={user?.id}
            onUpdateStatus={handleUpdateStatus}
          />
        ))
      )}
    </div>
  );
};

export default SessionsPage;
