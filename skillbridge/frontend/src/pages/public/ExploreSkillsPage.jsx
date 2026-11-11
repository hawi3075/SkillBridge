import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { skillApi } from '../../services/api';
import SkillCard from '../../components/cards/SkillCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Search, Filter, BookOpen, Layers } from 'lucide-react';

export const ExploreSkillsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const selectedDifficulty = searchParams.get('difficulty') || '';
  const searchKeyword = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(searchKeyword);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, skillsRes] = await Promise.all([
          skillApi.getCategories(),
          skillApi.getSkills({
            category: selectedCategory || undefined,
            difficulty: selectedDifficulty || undefined,
            search: searchKeyword || undefined
          })
        ]);

        if (catRes.success) setCategories(catRes.data || []);
        if (skillsRes.success) setSkills(skillsRes.data || []);
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedDifficulty, searchKeyword]);

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

  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId) {
      params.set('category', catId);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const handleDifficultyChange = (diff) => {
    const params = new URLSearchParams(searchParams);
    if (diff) {
      params.set('difficulty', diff);
    } else {
      params.delete('difficulty');
    }
    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">Marketplace</span>
          <h1 className="fw-extrabold text-dark mb-2">Explore Skills & Topics</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Discover hundreds of skills you can learn directly from knowledgeable peers through mutual knowledge exchange.
          </p>
        </div>

        {/* Category Pills Bar */}
        <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
          <button
            type="button"
            onClick={() => handleCategoryChange('')}
            className={`sb-tab-pill ${!selectedCategory ? 'active' : ''}`}
          >
            <span>All Categories</span>
            <span className="badge rounded-pill bg-light text-dark ms-1" style={{ fontSize: '0.68rem' }}>
              {categories.reduce((acc, c) => acc + (c.skills?.length || 0), 0) || skills.length}
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`sb-tab-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Filter & Search Bar */}
        <div className="sb-card p-4 mb-4 bg-white">
          <form onSubmit={handleSearchSubmit} className="row g-3">
            <div className="col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by skill name, technology, or topic..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 col-lg-2">
              <select
                className="form-select"
                value={selectedDifficulty}
                onChange={(e) => handleDifficultyChange(e.target.value)}
              >
                <option value="">All Difficulties</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div className="col-md-4 col-lg-2 d-flex gap-2">
              <button type="submit" className="btn btn-primary flex-grow-1">
                Filter
              </button>
              {(selectedCategory || selectedDifficulty || searchKeyword) && (
                <button type="button" onClick={resetFilters} className="btn btn-outline-secondary" title="Reset Filters">
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results Counter */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="text-muted small">
            Showing <strong>{skills.length}</strong> skills available for exchange
          </span>
        </div>

        {/* Skills Grid */}
        {loading ? (
          <LoadingSkeleton count={6} type="card" />
        ) : skills.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No skills found"
            description="We couldn't find any skills matching your search criteria. Try adjusting your keywords or category filters."
            actionLabel="Reset All Filters"
            onAction={resetFilters}
          />
        ) : (
          <div className="row g-4">
            {skills.map((skill) => (
              <div key={skill.id} className="col-md-6 col-lg-4">
                <SkillCard skill={skill} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreSkillsPage;
