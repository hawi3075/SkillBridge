import React, { useState, useEffect } from 'react';
import { adminApi, skillApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  ShieldAlert,
  Users,
  BookOpen,
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Trash2,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import Modal from '../../components/common/Modal';

export const AdminDashboardPage = () => {
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('ANALYTICS');
  const [loading, setLoading] = useState(true);

  // Search & Filter state for users
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // Modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillDifficulty, setNewSkillDifficulty] = useState('INTERMEDIATE');
  const [newSkillDesc, setNewSkillDesc] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, catsRes, repRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getUsers({ limit: 50 }),
        skillApi.getCategories(),
        adminApi.getReports()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data || []);
      if (catsRes.success) setCategories(catsRes.data || []);
      if (repRes.success) setReports(repRes.data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Error loading admin records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (user) => {
    const newStatus = !user.isActive;
    const actionLabel = newStatus ? 'activate' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${actionLabel} account @${user.username}?`)) return;

    try {
      const res = await adminApi.updateUserStatus(user.id, { isActive: newStatus });
      if (res.success) {
        showToast(`User @${user.username} has been ${newStatus ? 'activated' : 'suspended'}.`, 'success');
        setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, isActive: newStatus } : u)));
      }
    } catch (err) {
      showToast(err.message || 'Failed to update user status', 'error');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await skillApi.createCategory({ name: newCatName.trim(), description: newCatDesc.trim() });
      if (res.success) {
        showToast('New skill category added!', 'success');
        setCategories(prev => [...prev, res.data]);
        setIsCategoryModalOpen(false);
        setNewCatName('');
        setNewCatDesc('');
      }
    } catch (err) {
      showToast(err.message || 'Error creating category', 'error');
    }
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim() || !newSkillCategory) return;
    try {
      const res = await skillApi.createSkill({
        name: newSkillName.trim(),
        categoryId: newSkillCategory,
        difficulty: newSkillDifficulty,
        description: newSkillDesc.trim()
      });
      if (res.success) {
        showToast('Skill created successfully!', 'success');
        setIsSkillModalOpen(false);
        setNewSkillName('');
        setNewSkillDesc('');
      }
    } catch (err) {
      showToast(err.message || 'Error creating skill', 'error');
    }
  };

  const handleResolveReport = async (reportId, status, resolution) => {
    try {
      const res = await adminApi.updateReportStatus(reportId, { status, resolution });
      if (res.success) {
        showToast(`Report marked as ${status.toLowerCase()}`, 'success');
        setReports(prev => prev.map(r => (r.id === reportId ? { ...r, status, resolution } : r)));
      }
    } catch (err) {
      showToast('Error updating report', 'error');
    }
  };

  const filteredUsers = users.filter(u => {
    if (userRoleFilter && u.role !== userRoleFilter) return false;
    if (userSearch) {
      const q = userSearch.toLowerCase();
      return (
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.profile?.fullName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const summary = stats?.summary || {};

  return (
    <div className="py-4">
      {/* Admin Top Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h3 className="fw-extrabold text-dark mb-0">Platform Administration</h3>
            <span className="badge bg-danger text-white">SECURE SYSTEM</span>
          </div>
          <p className="text-muted small mb-0">
            Real-time control center for platform growth, user accounts, taxonomy, and trust moderation.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="btn-group btn-group-sm bg-white p-1 rounded-3 border">
          <button
            className={`btn btn-sm ${activeTab === 'ANALYTICS' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveTab('ANALYTICS')}
          >
            Analytics & Charts
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'USERS' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveTab('USERS')}
          >
            User Management ({users.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'CATEGORIES' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveTab('CATEGORIES')}
          >
            Skills & Categories
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'REPORTS' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveTab('REPORTS')}
          >
            Reports ({reports.filter(r => r.status === 'PENDING').length})
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="sb-card p-3 bg-white text-center">
            <div className="text-muted small fw-semibold">TOTAL USERS</div>
            <h3 className="fw-extrabold text-primary mb-0">{summary.totalUsers || 0}</h3>
            <div className="text-success small" style={{ fontSize: '0.72rem' }}>
              {summary.activeUsers || 0} Active
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="sb-card p-3 bg-white text-center">
            <div className="text-muted small fw-semibold">MENTORS</div>
            <h3 className="fw-extrabold text-indigo mb-0" style={{ color: '#6366F1' }}>
              {summary.totalMentors || 0}
            </h3>
            <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Verified Teachers</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="sb-card p-3 bg-white text-center">
            <div className="text-muted small fw-semibold">SKILL EXCHANGES</div>
            <h3 className="fw-extrabold text-dark mb-0">{summary.totalExchanges || 0}</h3>
            <div className="text-success small" style={{ fontSize: '0.72rem' }}>
              {summary.completedExchanges || 0} Completed
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="sb-card p-3 bg-white text-center">
            <div className="text-muted small fw-semibold">PENDING REPORTS</div>
            <h3 className="fw-extrabold text-danger mb-0">{summary.pendingReports || 0}</h3>
            <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Safety Queue</div>
          </div>
        </div>
      </div>

      {/* Tab 1: Analytics & Charts (Recharts) */}
      {activeTab === 'ANALYTICS' && (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="sb-card p-4 bg-white">
              <h6 className="fw-bold text-dark mb-1">Platform Growth Over Time</h6>
              <span className="text-muted small d-block mb-3">
                Monthly progression of registered users, skill exchanges, and completed sessions.
              </span>

              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.growthMetrics || []}>
                    <defs>
                      <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="exchGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="users" name="Registered Users" stroke="#2563EB" fillOpacity={1} fill="url(#userGrad)" />
                    <Area type="monotone" dataKey="exchanges" name="Exchanges" stroke="#6366F1" fillOpacity={1} fill="url(#exchGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="sb-card p-4 bg-white">
              <h6 className="fw-bold text-dark mb-1">Skills Distribution by Category</h6>
              <span className="text-muted small d-block mb-3">
                Active skill topics offered across the marketplace.
              </span>

              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.categoryDistribution || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" stroke="#94A3B8" fontSize={12} />
                    <YAxis dataKey="name" type="category" width={110} stroke="#94A3B8" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="skillsCount" name="Skills" fill="#2563EB" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Management Table */}
      {activeTab === 'USERS' && (
        <div className="sb-card bg-white p-4">
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name, email, or username..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-6">
              <select
                className="form-select"
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="USER">Regular Users</option>
                <option value="MENTOR">Mentors</option>
                <option value="ADMIN">Administrators</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr className="border-bottom text-muted small">
                  <th>USER</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>RATING</th>
                  <th>EXCHANGES</th>
                  <th className="text-end">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={u.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`}
                          alt=""
                          className="rounded-circle border"
                          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold text-dark small">{u.profile?.fullName || u.username}</div>
                          <div className="text-muted" style={{ fontSize: '0.72rem' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : u.role === 'MENTOR' ? 'bg-primary' : 'bg-light text-dark border'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="small fw-semibold">{Number(u.profile?.averageRating || 5.0).toFixed(1)} ★</td>
                    <td className="small">{u.profile?.completedExchanges || 0}</td>
                    <td className="text-end">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`btn btn-xs py-1 px-2 border small ${u.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {u.isActive ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Categories & Skills Management */}
      {activeTab === 'CATEGORIES' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-dark mb-0">Platform Taxonomy</h5>
            <div className="d-flex gap-2">
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
              >
                <Plus size={16} /> Add Category
              </button>
              <button
                onClick={() => {
                  if (categories.length > 0) setNewSkillCategory(categories[0].id);
                  setIsSkillModalOpen(true);
                }}
                className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
              >
                <Plus size={16} /> Add Skill
              </button>
            </div>
          </div>

          <div className="row g-4">
            {categories.map((cat) => (
              <div key={cat.id} className="col-md-6 col-lg-4">
                <div className="sb-card p-4 bg-white h-100">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold text-dark mb-0">{cat.name}</h6>
                    <span className="badge bg-light text-muted border small">{cat.skills?.length || 0} Skills</span>
                  </div>
                  <p className="text-muted small mb-3">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Category Modal */}
          <Modal
            isOpen={isCategoryModalOpen}
            onClose={() => setIsCategoryModalOpen(false)}
            title="Create Skill Category"
            size="sm"
          >
            <form onSubmit={handleCreateCategory}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Artificial Intelligence"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-semibold text-dark">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Brief description of skills in this category..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="btn btn-light">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Category</button>
              </div>
            </form>
          </Modal>

          {/* Add Skill Modal */}
          <Modal
            isOpen={isSkillModalOpen}
            onClose={() => setIsSkillModalOpen(false)}
            title="Create New Skill"
            size="md"
          >
            <form onSubmit={handleCreateSkill}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Skill Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Next.js 14"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-dark">Category</label>
                  <select
                    className="form-select"
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    required
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-dark">Difficulty</label>
                  <select
                    className="form-select"
                    value={newSkillDifficulty}
                    onChange={(e) => setNewSkillDifficulty(e.target.value)}
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label small fw-semibold text-dark">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Core concepts covered by this skill..."
                  required
                  value={newSkillDesc}
                  onChange={(e) => setNewSkillDesc(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setIsSkillModalOpen(false)} className="btn btn-light">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Skill</button>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {/* Tab 4: Reports & Trust Moderation */}
      {activeTab === 'REPORTS' && (
        <div className="sb-card bg-white p-4">
          <h5 className="fw-bold text-dark mb-3">Reported User Incidents</h5>
          {reports.length === 0 ? (
            <div className="text-center py-4 text-muted small">No safety reports submitted. Queue is clear!</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr className="border-bottom text-muted small">
                    <th>REPORTER</th>
                    <th>REPORTED USER</th>
                    <th>REASON & DETAILS</th>
                    <th>STATUS</th>
                    <th className="text-end">RESOLUTION</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id}>
                      <td className="small fw-semibold">{r.reporter?.profile?.fullName || r.reporter?.username}</td>
                      <td className="small fw-bold text-danger">{r.reportedUser?.profile?.fullName || r.reportedUser?.username}</td>
                      <td>
                        <div className="fw-bold small text-dark">{r.reason}</div>
                        <div className="text-muted small" style={{ fontSize: '0.78rem' }}>"{r.details}"</div>
                      </td>
                      <td>
                        <span className={`badge ${r.status === 'PENDING' ? 'bg-warning-subtle text-warning-emphasis' : 'bg-success-subtle text-success'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="text-end">
                        {r.status === 'PENDING' && (
                          <div className="d-flex gap-1 justify-content-end">
                            <button
                              onClick={() => handleResolveReport(r.id, 'RESOLVED', 'Warning issued to reported user')}
                              className="btn btn-xs btn-outline-success py-1 px-2 small"
                              style={{ fontSize: '0.75rem' }}
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() => handleResolveReport(r.id, 'DISMISSED', 'No violation found')}
                              className="btn btn-xs btn-outline-secondary py-1 px-2 small"
                              style={{ fontSize: '0.75rem' }}
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
                        {r.status !== 'PENDING' && (
                          <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                            {r.resolution || 'Handled'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
