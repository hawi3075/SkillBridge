import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { userApi, skillApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import UserCard from '../../components/cards/UserCard';
import ProposeExchangeModal from '../../components/forms/ProposeExchangeModal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Search, Filter, Users, Star, Award } from 'lucide-react';

export const FindMentorsPage = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [mentors, setMentors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Exchange proposal modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchKeyword = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedExp = searchParams.get('experience') || '';
  const selectedSort = searchParams.get('sort') || 'rating';

  const [searchInput, setSearchInput] = useState(searchKeyword);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const [catsRes, mentorsRes] = await Promise.all([
          skillApi.getCategories(),
          userApi.getUsers({
            isMentor: true,
            search: searchKeyword || undefined,
            category: selectedCategory || undefined,
            experienceLevel: selectedExp || undefined,
            sort: selectedSort
          })
        ]);

        if (catsRes.success) setCategories(catsRes.data || []);
        if (mentorsRes.success) setMentors(mentorsRes.data || []);
      } catch (err) {
        console.error('Error fetching mentors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [searchKeyword, selectedCategory, selectedExp, selectedSort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const updateParam = (key, val) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set(key, val);
    else params.delete(key);
    setSearchParams(params);
  };

  const handleRequestExchange = (mentor) => {
    if (!isAuthenticated) {
      showToast('Please log in or create an account to send exchange proposals', 'info');
      return;
    }
    setSelectedCandidate(mentor);
    setIsModalOpen(true);
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">Verified Mentors</span>
          <h1 className="fw-extrabold text-dark mb-2">Find Mentors & Teachers</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Connect with experienced practitioners offering personalized guidance. Trade your skills or schedule learning exchanges.
          </p>
        </div>

        {/* Category Pills Bar */}
        <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
          <button
            type="button"
            onClick={() => updateParam('category', '')}
            className={`sb-tab-pill ${!selectedCategory ? 'active' : ''}`}
          >
            <span>All Mentors</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateParam('category', cat.id)}
              className={`sb-tab-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="sb-card p-4 mb-4 bg-white">
          <form onSubmit={handleSearchSubmit} className="row g-3">
            <div className="col-lg-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by mentor name, skill, or keyword..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3 col-lg-3">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => updateParam('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3 col-lg-2">
              <select
                className="form-select"
                value={selectedExp}
                onChange={(e) => updateParam('experience', e.target.value)}
              >
                <option value="">Any Experience</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>

            <div className="col-md-3 col-lg-2">
              <select
                className="form-select"
                value={selectedSort}
                onChange={(e) => updateParam('sort', e.target.value)}
              >
                <option value="rating">Top Rated</option>
                <option value="exchanges">Most Completed</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <div className="col-md-3 col-lg-1">
              <button type="submit" className="btn btn-primary w-100">
                Filter
              </button>
            </div>
          </form>
        </div>

        {/* Results Info */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="text-muted small">
            Found <strong>{mentors.length}</strong> active mentors ready to exchange skills
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <LoadingSkeleton count={6} type="card" />
        ) : mentors.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No mentors found"
            description="No mentors matched your current filters. Try searching for different skills or clear your criteria."
            actionLabel="Clear Filters"
            onAction={() => { setSearchInput(''); setSearchParams({}); }}
          />
        ) : (
          <div className="row g-4">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="col-md-6 col-lg-4">
                <UserCard user={mentor} onRequestExchange={handleRequestExchange} />
              </div>
            ))}
          </div>
        )}

        {/* Propose Exchange Modal */}
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

export default FindMentorsPage;
