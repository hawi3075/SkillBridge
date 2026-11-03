import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { skillApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import UserCard from '../../components/cards/UserCard';
import ProposeExchangeModal from '../../components/forms/ProposeExchangeModal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { BookOpen, Users, CheckCircle, Plus, ArrowLeft } from 'lucide-react';

export const SkillDetailPage = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        setLoading(true);
        const res = await skillApi.getSkillBySlug(slug);
        if (res.success) {
          setSkill(res.data);
        }
      } catch (err) {
        console.error('Error fetching skill:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [slug]);

  const handleQuickAddOffered = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to add skills to your profile', 'info');
      return;
    }
    try {
      const res = await skillApi.addOfferedSkill({ skillId: skill.id, proficiencyLevel: 'INTERMEDIATE' });
      if (res.success) showToast(`Added ${skill.name} to your teaching profile!`, 'success');
    } catch (err) {
      showToast(err.message || 'Already added', 'info');
    }
  };

  const handleQuickAddWanted = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to add skills to your wishlist', 'info');
      return;
    }
    try {
      const res = await skillApi.addWantedSkill({ skillId: skill.id, priority: 'HIGH' });
      if (res.success) showToast(`Added ${skill.name} to your learning wishlist!`, 'success');
    } catch (err) {
      showToast(err.message || 'Already added', 'info');
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

  if (!skill) {
    return (
      <div className="py-5 bg-light min-vh-100">
        <div className="container" style={{ maxWidth: '600px' }}>
          <EmptyState
            title="Skill Not Found"
            description="The requested skill does not exist or has been modified."
            actionLabel="Explore All Skills"
            actionLink="/skills"
          />
        </div>
      </div>
    );
  }

  const mentorsOffering = (skill.offeredBy || []).map(off => off.user).filter(Boolean);

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: '960px' }}>
        <Link to="/skills" className="btn btn-sm btn-link text-decoration-none text-muted p-0 mb-3 d-inline-flex align-items-center gap-1">
          <ArrowLeft size={16} /> Back to All Skills
        </Link>

        {/* Skill Header Card */}
        <div className="sb-card p-4 p-md-5 bg-white mb-5">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
            <div className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BookOpen size={28} />
              </div>
              <div>
                <span className="badge bg-primary-subtle text-primary mb-1">
                  {skill.category?.name || 'Category'}
                </span>
                <h2 className="fw-extrabold text-dark mb-0">{skill.name}</h2>
              </div>
            </div>

            <span className="badge bg-light text-secondary border px-3 py-2">
              Difficulty: {skill.difficulty}
            </span>
          </div>

          <p className="text-muted lead mb-4" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
            {skill.description}
          </p>

          {/* Quick Actions */}
          <div className="d-flex flex-wrap gap-2 pt-3 border-top">
            <button
              onClick={handleQuickAddOffered}
              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
            >
              <Plus size={16} /> I Can Teach This Skill
            </button>
            <button
              onClick={handleQuickAddWanted}
              className="btn btn-sm btn-outline-indigo d-inline-flex align-items-center gap-1"
              style={{ color: '#4F46E5', borderColor: '#C7D2FE' }}
            >
              <Plus size={16} /> I Want to Learn This Skill
            </button>
          </div>
        </div>

        {/* Peers Offering this skill */}
        <div className="mb-4">
          <h4 className="fw-bold text-dark mb-1">Peers & Mentors Teaching {skill.name}</h4>
          <span className="text-muted small d-block mb-4">
            Connect directly with knowledgeable community members ready for a skill exchange.
          </span>

          {mentorsOffering.length === 0 ? (
            <div className="sb-card p-4 bg-white text-center">
              <p className="text-muted small mb-0">Be the first to offer this skill! Click "I Can Teach This Skill" above.</p>
            </div>
          ) : (
            <div className="row g-4">
              {mentorsOffering.map((user) => (
                <div key={user.id} className="col-md-6">
                  <UserCard
                    user={user}
                    onRequestExchange={(cand) => {
                      setSelectedCandidate(cand);
                      setIsModalOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Propose Modal */}
        {selectedCandidate && (
          <ProposeExchangeModal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setSelectedCandidate(null); }}
            candidate={selectedCandidate}
          />
        )}
      </div>
    </div>
  );
};

export default SkillDetailPage;
