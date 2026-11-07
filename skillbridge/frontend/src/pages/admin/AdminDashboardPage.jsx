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
  ShieldCheck,
  Users,
  BookOpen,
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  TrendingUp,
  RefreshCw,
  GraduationCap,
  Sparkles,
  ExternalLink,
  UserCheck,
  UserX,
  Database,
  Filter,
  Layers,
  Activity
} from 'lucide-react';
import Modal from '../../components/common/Modal';

// Custom Recharts Glass Tooltip
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-3 rounded-3 shadow-lg"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          fontSize: '0.8rem'
        }}
      >
        <div className="fw-bold mb-1 text-white-50">{label}</div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="d-flex align-items-center gap-2 mb-0.5">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }}></span>
            <span>{entry.name}:</span>
            <span className="fw-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const AdminDashboardPage = () => {
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('ANALYTICS');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Filter state for users
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');

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

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchAdminData();
    setIsRefreshing(false);
    showToast('Platform diagnostics updated!', 'success');
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
        // Refresh categories to update skills count
        const catsRes = await skillApi.getCategories();
        if (catsRes.success) setCategories(catsRes.data || []);
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
    if (userStatusFilter === 'ACTIVE' && !u.isActive) return false;
    if (userStatusFilter === 'SUSPENDED' && u.isActive) return false;
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
  const pendingReportsCount = reports.filter(r => r.status === 'PENDING').length;

  return (
    <div className="py-2">
      {/* 1. Mission Control Executive Header */}
      <div className="admin-card p-4 p-md-4 mb-4">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #4F46E5 100%)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)'
              }}
            >
              <ShieldAlert size={26} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h4 className="fw-extrabold text-dark mb-0" style={{ letterSpacing: '-0.02em' }}>
                  Platform Command Center
                </h4>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                  SUPERADMIN
                </span>
              </div>
              <p className="text-muted small mb-0 mt-0.5">
                Real-time operational analytics, access governance, taxonomy, and trust moderation.
              </p>
            </div>
          </div>

          {/* Quick System Status & Actions */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            <div className="admin-system-chip">
              <span className="pulse-dot"></span>
              <span>Neon PostgreSQL: Live</span>
            </div>
            <div className="admin-system-chip">
              <Activity size={13} color="#2563EB" />
              <span>Socket.IO Engine: Active</span>
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="btn btn-sm btn-light border px-3 d-inline-flex align-items-center gap-1.5 shadow-sm"
              style={{ fontSize: '0.8rem', fontWeight: 600 }}
              title="Sync latest live database metrics"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Executive KPI Cards */}
      <div className="row g-3 mb-4">
        {/* Total Users */}
        <div className="col-sm-6 col-lg-3">
          <div className="admin-kpi-card kpi-blue">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                TOTAL USERS
              </span>
              <div className="admin-kpi-icon" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                <Users size={20} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h2 className="fw-extrabold text-dark mb-0" style={{ letterSpacing: '-0.03em' }}>
                {summary.totalUsers || 0}
              </h2>
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{ fontSize: '0.7rem' }}>
                {summary.activeUsers || 0} Active
              </span>
            </div>
            <div className="text-muted small" style={{ fontSize: '0.76rem' }}>
              Registered network accounts
            </div>
          </div>
        </div>

        {/* Verified Mentors */}
        <div className="col-sm-6 col-lg-3">
          <div className="admin-kpi-card kpi-indigo">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                VERIFIED MENTORS
              </span>
              <div className="admin-kpi-icon" style={{ backgroundColor: '#EEF2FF', color: '#6366F1' }}>
                <GraduationCap size={20} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h2 className="fw-extrabold text-dark mb-0" style={{ letterSpacing: '-0.03em', color: '#4F46E5' }}>
                {summary.totalMentors || 0}
              </h2>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill" style={{ fontSize: '0.7rem' }}>
                {summary.totalUsers ? Math.round((summary.totalMentors / summary.totalUsers) * 100) : 0}% Ratio
              </span>
            </div>
            <div className="text-muted small" style={{ fontSize: '0.76rem' }}>
              Qualified peer instructors
            </div>
          </div>
        </div>

        {/* Skill Exchanges */}
        <div className="col-sm-6 col-lg-3">
          <div className="admin-kpi-card kpi-emerald">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                SKILL EXCHANGES
              </span>
              <div className="admin-kpi-icon" style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}>
                <ArrowRightLeft size={20} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h2 className="fw-extrabold text-dark mb-0" style={{ letterSpacing: '-0.03em', color: '#059669' }}>
                {summary.totalExchanges || 0}
              </h2>
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{ fontSize: '0.7rem' }}>
                {summary.completedExchanges || 0} Completed
              </span>
            </div>
            <div className="text-muted small" style={{ fontSize: '0.76rem' }}>
              100% reciprocal peer trades
            </div>
          </div>
        </div>

        {/* Safety & Reports */}
        <div className="col-sm-6 col-lg-3">
          <div className="admin-kpi-card kpi-rose">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                MODERATION QUEUE
              </span>
              <div className="admin-kpi-icon" style={{ backgroundColor: '#FFF1F2', color: '#F43F5E' }}>
                <AlertTriangle size={20} />
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h2 className="fw-extrabold text-dark mb-0" style={{ letterSpacing: '-0.03em', color: pendingReportsCount > 0 ? '#E11D48' : '#0F172A' }}>
                {pendingReportsCount}
              </h2>
              <span
                className={`badge rounded-pill ${
                  pendingReportsCount === 0
                    ? 'bg-success-subtle text-success border border-success-subtle'
                    : 'bg-danger text-white'
                }`}
                style={{ fontSize: '0.7rem' }}
              >
                {pendingReportsCount === 0 ? 'Queue Clean' : 'Action Needed'}
              </span>
            </div>
            <div className="text-muted small" style={{ fontSize: '0.76rem' }}>
              Safety & dispute incidents
            </div>
          </div>
        </div>
      </div>

      {/* 3. Floating Segmented Navigation Bar */}
      <div className="admin-card p-1.5 mb-4 d-inline-flex flex-wrap gap-1 bg-white border">
        <button
          className={`admin-nav-pill ${activeTab === 'ANALYTICS' ? 'active' : ''}`}
          onClick={() => setActiveTab('ANALYTICS')}
        >
          <TrendingUp size={16} />
          <span>Analytics & Trends</span>
        </button>

        <button
          className={`admin-nav-pill ${activeTab === 'USERS' ? 'active' : ''}`}
          onClick={() => setActiveTab('USERS')}
        >
          <Users size={16} />
          <span>User Accounts</span>
          <span className="badge rounded-pill bg-light text-dark border px-2" style={{ fontSize: '0.7rem' }}>
            {users.length}
          </span>
        </button>

        <button
          className={`admin-nav-pill ${activeTab === 'CATEGORIES' ? 'active' : ''}`}
          onClick={() => setActiveTab('CATEGORIES')}
        >
          <BookOpen size={16} />
          <span>Skills & Taxonomy</span>
          <span className="badge rounded-pill bg-light text-dark border px-2" style={{ fontSize: '0.7rem' }}>
            {categories.length}
          </span>
        </button>

        <button
          className={`admin-nav-pill ${activeTab === 'REPORTS' ? 'active' : ''}`}
          onClick={() => setActiveTab('REPORTS')}
        >
          <ShieldAlert size={16} />
          <span>Moderation Queue</span>
          {pendingReportsCount > 0 && (
            <span className="badge rounded-pill bg-danger text-white px-2" style={{ fontSize: '0.7rem' }}>
              {pendingReportsCount}
            </span>
          )}
        </button>
      </div>

      {/* 4. Tab 1: Analytics & Charts */}
      {activeTab === 'ANALYTICS' && (
        <div className="row g-4">
          {/* Growth Area Chart */}
          <div className="col-lg-7">
            <div className="admin-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <div>
                  <h6 className="fw-bold text-dark mb-0">Platform Growth Velocity</h6>
                  <span className="text-muted small">Monthly progression of active users & peer exchanges</span>
                </div>
                <span className="badge bg-light text-secondary border small px-2.5 py-1">Time Series</span>
              </div>

              <div style={{ width: '100%', height: '310px' }} className="mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.growthMetrics || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="exchGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                    <Area
                      type="monotone"
                      dataKey="users"
                      name="Registered Users"
                      stroke="#2563EB"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#userGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="exchanges"
                      name="Exchanges"
                      stroke="#6366F1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#exchGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Bottom Insight Strip */}
              <div className="row g-2 pt-3 mt-2 border-top text-center text-secondary small">
                <div className="col-4 border-end">
                  <div className="fw-bold text-dark">100% Free</div>
                  <div style={{ fontSize: '0.72rem' }}>Reciprocal Network</div>
                </div>
                <div className="col-4 border-end">
                  <div className="fw-bold text-primary">84% Match Avg</div>
                  <div style={{ fontSize: '0.72rem' }}>Algorithm Precision</div>
                </div>
                <div className="col-4">
                  <div className="fw-bold text-success">99.9% Uptime</div>
                  <div style={{ fontSize: '0.72rem' }}>Neon Cloud DB</div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution Bar Chart */}
          <div className="col-lg-5">
            <div className="admin-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <div>
                  <h6 className="fw-bold text-dark mb-0">Skills by Taxonomy</h6>
                  <span className="text-muted small">Distribution of active skill offerings</span>
                </div>
                <span className="badge bg-light text-secondary border small px-2.5 py-1">Categories</span>
              </div>

              <div style={{ width: '100%', height: '310px' }} className="mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.categoryDistribution || []} layout="vertical" margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" width={115} stroke="#475569" fontSize={11} tickLine={false} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Bar dataKey="skillsCount" name="Skills Available" fill="#2563EB" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-3 mt-2 border-top d-flex justify-content-between align-items-center text-muted small" style={{ fontSize: '0.75rem' }}>
                <span>Total Categories: <strong>{categories.length}</strong></span>
                <span>Marketplace Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: User Accounts Management Table */}
      {activeTab === 'USERS' && (
        <div className="admin-card p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <h5 className="fw-bold text-dark mb-0">Platform User Directory</h5>
              <span className="text-muted small">Inspect, manage, and moderate user credentials and access permissions</span>
            </div>

            <span className="badge bg-light text-secondary border px-3 py-1.5 rounded-pill" style={{ fontSize: '0.78rem' }}>
              Showing {filteredUsers.length} of {users.length} Users
            </span>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="row g-2 mb-3">
            <div className="col-md-6">
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by full name, email, or @username..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
                {userSearch && (
                  <button onClick={() => setUserSearch('')} className="btn btn-outline-secondary border-start-0">
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select shadow-sm"
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              >
                <option value="">Filter by Role (All)</option>
                <option value="USER">Learners (USER)</option>
                <option value="MENTOR">Mentors (MENTOR)</option>
                <option value="ADMIN">Administrators (ADMIN)</option>
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select shadow-sm"
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              >
                <option value="">Filter by Status (All)</option>
                <option value="ACTIVE">Active Accounts</option>
                <option value="SUSPENDED">Suspended Accounts</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="admin-table-container">
            <div className="table-responsive">
              <table className="admin-table align-middle">
                <thead>
                  <tr>
                    <th>USER PROFILE</th>
                    <th>ROLE</th>
                    <th>STATUS</th>
                    <th>RATING</th>
                    <th>EXCHANGES</th>
                    <th className="text-end">GOVERNANCE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        No users match the search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={u.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`}
                              alt=""
                              className="rounded-circle border"
                              style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-bold text-dark d-flex align-items-center gap-1.5" style={{ fontSize: '0.88rem' }}>
                                <span>{u.profile?.fullName || u.username}</span>
                                <span className="text-muted fw-normal" style={{ fontSize: '0.74rem' }}>
                                  @{u.username}
                                </span>
                              </div>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`admin-badge ${
                              u.role === 'ADMIN'
                                ? 'admin-badge-admin'
                                : u.role === 'MENTOR'
                                ? 'admin-badge-mentor'
                                : 'admin-badge-user'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`admin-badge ${
                              u.isActive ? 'admin-badge-active' : 'admin-badge-suspended'
                            }`}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: u.isActive ? '#10B981' : '#EF4444'
                              }}
                            ></span>
                            <span>{u.isActive ? 'Active' : 'Suspended'}</span>
                          </span>
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <span className="text-warning fw-bold small">★</span>
                            <span className="fw-bold text-dark small">
                              {Number(u.profile?.averageRating || 5.0).toFixed(1)}
                            </span>
                            <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                              ({u.profile?.totalReviews || 0})
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="badge bg-light text-dark border fw-semibold" style={{ fontSize: '0.76rem' }}>
                            {u.profile?.completedExchanges || 0} sessions
                          </span>
                        </td>

                        <td className="text-end">
                          {u.role !== 'ADMIN' ? (
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              className={`btn btn-sm py-1 px-2.5 rounded-pill d-inline-flex align-items-center gap-1 border shadow-sm ${
                                u.isActive
                                  ? 'btn-outline-danger'
                                  : 'btn-outline-success'
                              }`}
                              style={{ fontSize: '0.75rem', fontWeight: 600 }}
                            >
                              {u.isActive ? (
                                <>
                                  <UserX size={13} />
                                  <span>Suspend</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck size={13} />
                                  <span>Activate</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="badge bg-secondary-subtle text-secondary small px-2">Protected</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Skills & Taxonomy */}
      {activeTab === 'CATEGORIES' && (
        <div>
          {/* Taxonomy Header & Action Buttons */}
          <div className="admin-card p-3 p-md-4 mb-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
              <div>
                <h5 className="fw-bold text-dark mb-0">Platform Skill Taxonomy</h5>
                <span className="text-muted small">Manage knowledge domains, categories, and marketplace topics</span>
              </div>

              <div className="d-flex gap-2">
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 shadow-sm fw-semibold"
                >
                  <Plus size={15} />
                  <span>Add Category</span>
                </button>
                <button
                  onClick={() => {
                    if (categories.length > 0) setNewSkillCategory(categories[0].id);
                    setIsSkillModalOpen(true);
                  }}
                  className="btn btn-sm btn-primary rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 shadow-sm fw-semibold"
                >
                  <Plus size={15} />
                  <span>Create Skill</span>
                </button>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="row g-3">
            {categories.map((cat) => (
              <div key={cat.id} className="col-md-6 col-lg-4">
                <div className="admin-card admin-card-hover p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: '#EFF6FF',
                            color: '#2563EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <BookOpen size={16} />
                        </div>
                        <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>{cat.name}</h6>
                      </div>
                      <span className="badge bg-light text-primary border rounded-pill px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                        {cat.skills?.length || 0} Skills
                      </span>
                    </div>

                    <p className="text-muted small mb-3" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                      {cat.description || 'No description available for this category.'}
                    </p>

                    {/* Skill tags preview */}
                    {cat.skills && cat.skills.length > 0 && (
                      <div className="d-flex flex-wrap gap-1.5 mb-3">
                        {cat.skills.slice(0, 4).map((sk) => (
                          <span
                            key={sk.id}
                            className="badge bg-light text-dark border"
                            style={{ fontSize: '0.7rem', fontWeight: 500 }}
                          >
                            {sk.name}
                          </span>
                        ))}
                        {cat.skills.length > 4 && (
                          <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.7rem' }}>
                            +{cat.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-top d-flex justify-content-between align-items-center">
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>Slug: /{cat.slug}</span>
                    <button
                      onClick={() => {
                        setNewSkillCategory(cat.id);
                        setIsSkillModalOpen(true);
                      }}
                      className="btn btn-sm btn-link p-0 text-decoration-none text-primary"
                      style={{ fontSize: '0.76rem', fontWeight: 600 }}
                    >
                      + Add to {cat.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal: Add Category */}
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
                  rows="3"
                  placeholder="Brief description of skills covered in this category..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="btn btn-light rounded-pill px-3">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary rounded-pill px-4">
                  Save Category
                </button>
              </div>
            </form>
          </Modal>

          {/* Modal: Add Skill */}
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
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-dark">Difficulty Level</label>
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
                  rows="3"
                  placeholder="Core concepts covered by this skill..."
                  required
                  value={newSkillDesc}
                  onChange={(e) => setNewSkillDesc(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setIsSkillModalOpen(false)} className="btn btn-light rounded-pill px-3">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary rounded-pill px-4">
                  Save Skill
                </button>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {/* 7. Tab 4: Reports & Trust Moderation */}
      {activeTab === 'REPORTS' && (
        <div className="admin-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold text-dark mb-0">Safety & Incident Reports</h5>
              <span className="text-muted small">Investigate reported conduct violations, disputes, and safety alerts</span>
            </div>

            <span className="badge bg-light text-secondary border px-3 py-1.5 rounded-pill" style={{ fontSize: '0.78rem' }}>
              {pendingReportsCount} Pending Incident{pendingReportsCount === 1 ? '' : 's'}
            </span>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="mx-auto mb-3"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShieldCheck size={32} />
              </div>
              <h6 className="fw-bold text-dark mb-1">Safety Queue is Completely Clear</h6>
              <p className="text-muted small mb-0" style={{ maxWidth: '400px', margin: '0 auto' }}>
                Zero active complaints or user conduct violations reported. The community is healthy!
              </p>
            </div>
          ) : (
            <div className="admin-table-container">
              <div className="table-responsive">
                <table className="admin-table align-middle">
                  <thead>
                    <tr>
                      <th>REPORTER</th>
                      <th>REPORTED USER</th>
                      <th>REASON & CONTEXT</th>
                      <th>STATUS</th>
                      <th className="text-end">RESOLUTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <div className="fw-bold text-dark small">
                            {r.reporter?.profile?.fullName || r.reporter?.username}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.72rem' }}>@{r.reporter?.username}</div>
                        </td>

                        <td>
                          <div className="fw-bold text-danger small">
                            {r.reportedUser?.profile?.fullName || r.reportedUser?.username}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.72rem' }}>@{r.reportedUser?.username}</div>
                        </td>

                        <td style={{ maxWidth: '300px' }}>
                          <span className="badge bg-light text-dark border mb-1 fw-semibold" style={{ fontSize: '0.72rem' }}>
                            {r.reason}
                          </span>
                          <div className="text-secondary small text-truncate" style={{ fontSize: '0.78rem' }}>
                            "{r.details}"
                          </div>
                        </td>

                        <td>
                          <span
                            className={`admin-badge ${
                              r.status === 'PENDING'
                                ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                                : r.status === 'RESOLVED'
                                ? 'admin-badge-active'
                                : 'admin-badge-user'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>

                        <td className="text-end">
                          {r.status === 'PENDING' ? (
                            <div className="d-flex gap-1.5 justify-content-end">
                              <button
                                onClick={() => handleResolveReport(r.id, 'RESOLVED', 'Warning issued to reported user')}
                                className="btn btn-sm btn-outline-success rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1 shadow-sm"
                                style={{ fontSize: '0.75rem', fontWeight: 600 }}
                              >
                                <CheckCircle2 size={12} />
                                <span>Resolve</span>
                              </button>
                              <button
                                onClick={() => handleResolveReport(r.id, 'DISMISSED', 'No violation found')}
                                className="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1 shadow-sm"
                                style={{ fontSize: '0.75rem', fontWeight: 600 }}
                              >
                                <XCircle size={12} />
                                <span>Dismiss</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted small" style={{ fontSize: '0.76rem' }}>
                              {r.resolution || 'Handled'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
