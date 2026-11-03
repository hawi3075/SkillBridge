import React, { useState, useEffect } from 'react';
import { matchApi } from '../../services/api';
import MatchCard from '../../components/cards/MatchCard';
import ProposeExchangeModal from '../../components/forms/ProposeExchangeModal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mutualOnly, setMutualOnly] = useState(false);
  const [minScore, setMinScore] = useState(0);

  // Proposal Modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await matchApi.getMatches();
      if (res.success) {
        setMatches(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePropose = (candidate, match) => {
    setSelectedCandidate(candidate);
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const filteredMatches = matches.filter(m => {
    if (mutualOnly && !m.isMutualMatch) return false;
    if (minScore > 0 && m.matchPercentage < minScore) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Smart Skill Matches</h4>
          <span className="text-muted small">
            Transparently computed from your skills, language, experience, and availability.
          </span>
        </div>

        {/* Filters */}
        <div className="d-flex align-items-center gap-3 bg-white p-2 px-3 rounded-3 border">
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              id="mutualFilter"
              checked={mutualOnly}
              onChange={(e) => setMutualOnly(e.target.checked)}
            />
            <label className="form-check-label small fw-semibold text-dark" htmlFor="mutualFilter">
              Mutual Matches Only
            </label>
          </div>

          <div className="d-flex align-items-center gap-2 border-start ps-3">
            <span className="small text-muted">Min:</span>
            <select
              className="form-select form-select-sm"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              style={{ width: '100px' }}
            >
              <option value="0">All</option>
              <option value="80">80%+</option>
              <option value="90">90%+</option>
              <option value="95">95%+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matches List */}
      {loading ? (
        <LoadingSkeleton count={4} type="card" />
      ) : filteredMatches.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No compatible matches with current filters"
          description="Try loosening your filters, or add more skills to your teaching inventory and learning wishlist to expand compatibility."
          actionLabel="Clear Filter"
          onAction={() => { setMutualOnly(false); setMinScore(0); }}
        />
      ) : (
        filteredMatches.map((match, idx) => (
          <MatchCard key={idx} match={match} onProposeExchange={handlePropose} />
        ))
      )}

      {/* Modal */}
      {selectedCandidate && (
        <ProposeExchangeModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedCandidate(null); }}
          candidate={selectedCandidate}
          initialMatch={selectedMatch}
          onSuccess={fetchMatches}
        />
      )}
    </div>
  );
};

export default MatchesPage;
