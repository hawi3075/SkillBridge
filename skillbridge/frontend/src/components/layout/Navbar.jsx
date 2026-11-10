import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationApi } from '../../services/api';
import {
  Compass,
  Users,
  HelpCircle,
  Bell,
  MessageSquare,
  Sparkles,
  LogOut,
  User,
  ShieldAlert,
  GraduationCap,
  Calendar,
  CheckCheck,
  Menu,
  X,
  Search
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isMentor, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000); // 30s poll
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.slice(0, 5));
        setUnreadCount(res.meta?.unreadCount || 0);
      }
    } catch (e) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/skills?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sb-navbar navbar navbar-expand-lg">
      <div className="container py-1">
        {/* Brand Logo with Graduation Cap */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div className="sb-brand-icon">
            <GraduationCap size={24} />
          </div>
          <span className="fw-bolder fs-4" style={{ letterSpacing: '-0.03em', color: '#0F172A' }}>
            Skill<span style={{ color: '#2563EB' }}>Bridge</span>
          </span>
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Links */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 align-items-center">
            <li className="nav-item">
              <NavLink to="/" end className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/skills" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Courses
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/mentors" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Mentors
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/how-it-works" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Right Action Menu */}
          <div className="d-flex align-items-center gap-2">
            {/* Search Pill Input */}
            <form onSubmit={handleSearchSubmit} className="d-none d-lg-flex position-relative me-2" style={{ width: '200px' }}>
              <Search size={15} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control form-control-sm rounded-pill ps-5 border-0 shadow-none"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.825rem', paddingTop: '0.45rem', paddingBottom: '0.45rem', backgroundColor: '#F1F5F9' }}
              />
            </form>
            {isAuthenticated ? (
              <>
                {/* Smart Matches link */}
                <Link
                  to="/dashboard/matches"
                  className="btn btn-sm btn-outline-primary d-none d-md-inline-flex align-items-center gap-1"
                >
                  <Sparkles size={16} />
                  <span>Matches</span>
                </Link>

                {/* Messages link */}
                <Link
                  to="/dashboard/messages"
                  className="btn btn-light rounded-circle p-2 text-dark position-relative"
                  title="Messages"
                >
                  <MessageSquare size={18} />
                </Link>

                {/* Notifications Dropdown */}
                <div className="position-relative">
                  <button
                    className="btn btn-light rounded-circle p-2 text-dark position-relative"
                    onClick={() => setShowNotifMenu(!showNotifMenu)}
                    title="Notifications"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifMenu && (
                    <div
                      className="sb-card position-absolute end-0 mt-2 shadow-lg p-0"
                      style={{ width: '320px', zIndex: 1100, borderRadius: '12px', overflow: 'hidden' }}
                    >
                      <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                        <span className="fw-bold small text-dark">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="btn btn-link btn-sm p-0 text-decoration-none small"
                            style={{ fontSize: '0.75rem' }}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                          <div className="p-3 text-center text-muted small">No new notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <Link
                              key={n.id}
                              to={n.link || '/dashboard'}
                              onClick={() => setShowNotifMenu(false)}
                              className={`p-3 d-block text-decoration-none border-bottom ${n.isRead ? 'bg-white' : 'bg-light'}`}
                            >
                              <div className="fw-bold text-dark small mb-1">{n.title}</div>
                              <div className="text-muted small" style={{ fontSize: '0.8rem' }}>
                                {n.message}
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                      <div className="p-2 text-center bg-light">
                        <Link
                          to="/dashboard/notifications"
                          onClick={() => setShowNotifMenu(false)}
                          className="small text-decoration-none fw-semibold"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar Menu */}
                <div className="position-relative">
                  <button
                    className="btn p-0 border-0 d-flex align-items-center gap-2"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <img
                      src={user?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`}
                      alt={user?.profile?.fullName || user?.username}
                      className="rounded-circle border"
                      style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                    />
                  </button>

                  {showUserMenu && (
                    <div
                      className="sb-card position-absolute end-0 mt-2 shadow-lg p-2"
                      style={{ width: '230px', zIndex: 1100, borderRadius: '12px' }}
                    >
                      <div className="px-3 py-2 border-bottom mb-1">
                        <div className="fw-bold text-dark text-truncate">{user?.profile?.fullName || user?.username}</div>
                        <div className="text-muted small text-truncate">@{user?.username}</div>
                        <span className="badge bg-primary-subtle text-primary mt-1" style={{ fontSize: '0.7rem' }}>
                          {user?.role}
                        </span>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="dropdown-item py-2 px-3 rounded d-flex align-items-center gap-2 small"
                      >
                        <User size={16} /> Dashboard
                      </Link>

                      <Link
                        to="/dashboard/exchanges"
                        onClick={() => setShowUserMenu(false)}
                        className="dropdown-item py-2 px-3 rounded d-flex align-items-center gap-2 small"
                      >
                        <Sparkles size={16} /> Skill Exchanges
                      </Link>

                      <Link
                        to="/dashboard/sessions"
                        onClick={() => setShowUserMenu(false)}
                        className="dropdown-item py-2 px-3 rounded d-flex align-items-center gap-2 small"
                      >
                        <Calendar size={16} /> Sessions
                      </Link>

                      {isMentor && (
                        <Link
                          to="/mentor/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="dropdown-item py-2 px-3 rounded d-flex align-items-center gap-2 small text-primary fw-semibold"
                        >
                          <GraduationCap size={16} /> Mentor Portal
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="dropdown-item py-2 px-3 rounded d-flex align-items-center gap-2 small text-danger fw-semibold"
                        >
                          <ShieldAlert size={16} /> Admin Panel
                        </Link>
                      )}

                      <hr className="my-1" />

                      <button
                        onClick={handleLogout}
                        className="dropdown-item py-2 px-3 rounded d-flex align-items-center gap-2 small text-danger"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/login"
                  className="btn btn-sm btn-light rounded-pill text-dark fw-semibold px-3 py-1 border shadow-none"
                  style={{ backgroundColor: '#FFFFFF', fontSize: '0.88rem' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-sm btn-primary rounded-pill fw-semibold px-3 py-1 shadow-sm"
                  style={{ backgroundColor: '#1D4ED8', borderColor: '#1D4ED8', fontSize: '0.88rem' }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
