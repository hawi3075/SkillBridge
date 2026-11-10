import React, { useState, useEffect } from 'react';
import { exchangeApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ExchangeCard from '../../components/cards/ExchangeCard';
import ScheduleSessionModal from '../../components/forms/ScheduleSessionModal';
import ReviewModal from '../../components/forms/ReviewModal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { ArrowRightLeft, Clock, Check, Calendar } from 'lucide-react';

export const ExchangesPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [exchanges, setExchanges] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedExchangeForSession, setSelectedExchangeForSession] = useState(null);
  const [selectedExchangeForReview, setSelectedExchangeForReview] = useState(null);

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      setLoading(true);
      const res = await exchangeApi.getExchanges();
      if (res.success) {
        setExchanges(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching exchanges:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await exchangeApi.acceptExchange(id);
      if (res.success) {
        showToast('Exchange proposal accepted! You can now chat and schedule learning sessions.', 'success');
        fetchExchanges();
      }
    } catch (err) {
      showToast(err.message || 'Failed to accept exchange', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await exchangeApi.rejectExchange(id);
      if (res.success) {
        showToast('Proposal declined.', 'info');
        fetchExchanges();
      }
    } catch (err) {
      showToast(err.message || 'Failed to decline proposal', 'error');
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await exchangeApi.completeExchange(id);
      if (res.success) {
        showToast('Exchange marked as completed! Don’t forget to leave a review.', 'success');
        fetchExchanges();
      }
    } catch (err) {
      showToast(err.message || 'Failed to complete exchange', 'error');
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await exchangeApi.cancelExchange(id);
      if (res.success) {
        showToast('Exchange proposal cancelled.', 'info');
        fetchExchanges();
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel exchange', 'error');
    }
  };

  const filteredExchanges = exchanges.filter(e => {
    if (activeTab === 'PENDING') return e.status === 'PENDING';
    if (activeTab === 'ACTIVE') return ['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS'].includes(e.status);
    if (activeTab === 'COMPLETED') return e.status === 'COMPLETED';
    if (activeTab === 'CLOSED') return ['REJECTED', 'CANCELLED'].includes(e.status);
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">My Skill Exchanges</h4>
          <span className="text-muted small">Manage your sent proposals, incoming requests, and active exchanges.</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="sb-card p-2 bg-white mb-4">
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className={`sb-tab-pill ${activeTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveTab('ALL')}
          >
            All Exchanges ({exchanges.length})
          </button>
          <button
            type="button"
            className={`sb-tab-pill ${activeTab === 'PENDING' ? 'active' : ''}`}
            onClick={() => setActiveTab('PENDING')}
          >
            Pending ({exchanges.filter(e => e.status === 'PENDING').length})
          </button>
          <button
            type="button"
            className={`sb-tab-pill ${activeTab === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => setActiveTab('ACTIVE')}
          >
            Active ({exchanges.filter(e => ['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS'].includes(e.status)).length})
          </button>
          <button
            type="button"
            className={`sb-tab-pill ${activeTab === 'COMPLETED' ? 'active' : ''}`}
            onClick={() => setActiveTab('COMPLETED')}
          >
            Completed ({exchanges.filter(e => e.status === 'COMPLETED').length})
          </button>
          <button
            type="button"
            className={`sb-tab-pill ${activeTab === 'CLOSED' ? 'active' : ''}`}
            onClick={() => setActiveTab('CLOSED')}
          >
            Closed / Declined
          </button>
        </div>
      </div>

      {/* Exchange Cards List */}
      {loading ? (
        <LoadingSkeleton count={3} type="table" />
      ) : filteredExchanges.length === 0 ? (
        <EmptyState
          icon={ArrowRightLeft}
          title="No exchanges found in this view"
          description="Ready to learn something new? Browse compatible matches and send your first exchange proposal today!"
          actionLabel="Find Matches"
          actionLink="/dashboard/matches"
        />
      ) : (
        filteredExchanges.map(ex => (
          <ExchangeCard
            key={ex.id}
            exchange={ex}
            currentUserId={user?.id}
            onAccept={handleAccept}
            onReject={handleReject}
            onComplete={handleComplete}
            onCancel={handleCancel}
            onOpenScheduleModal={(e) => setSelectedExchangeForSession(e)}
            onOpenReviewModal={(e) => setSelectedExchangeForReview(e)}
          />
        ))
      )}

      {/* Schedule Session Modal */}
      {selectedExchangeForSession && (
        <ScheduleSessionModal
          isOpen={!!selectedExchangeForSession}
          onClose={() => setSelectedExchangeForSession(null)}
          exchange={selectedExchangeForSession}
          onSuccess={fetchExchanges}
        />
      )}

      {/* Review Modal */}
      {selectedExchangeForReview && (
        <ReviewModal
          isOpen={!!selectedExchangeForReview}
          onClose={() => setSelectedExchangeForReview(null)}
          exchange={selectedExchangeForReview}
          onSuccess={fetchExchanges}
        />
      )}
    </div>
  );
};

export default ExchangesPage;
