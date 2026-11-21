import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationApi } from '../../services/api';
import {
  Compass, Users, HelpCircle, Bell, MessageSquare, ArrowRightLeft,
  LogOut, User, ShieldAlert, GraduationCap, Calendar, CheckCheck,
  Menu, X, Search, ArrowRight, Zap
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home',         to: '/',            end: true  },
  { label: 'Courses',      to: '/skills'                  },
  { label: 'Mentors',      to: '/mentors'                 },
  { label: 'How It Works', to: '/how-it-works'            },
  { label: 'About',        to: '/about'                   },
  { label: 'Contact',      to: '/contact'                 },
];

export const Navbar = () => {
  const { user, isAuthenticated, isMentor, isAdmin, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [notifications,   setNotifications]   = useState([]);
  const [unreadCount,     setUnreadCount]     = useState(0);
  const [showNotifMenu,   setShowNotifMenu]   = useState(false);
  const [showUserMenu,    setShowUserMenu]    = useState(false);
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const [searchQuery,     setSearchQuery]     = useState('');

  /* close mobile menu on route change */
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  /* lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      const id = setInterval(loadNotifications, 30000);
      return () => clearInterval(id);
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.slice(0, 5));
        setUnreadCount(res.meta?.unreadCount || 0);
      }
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/skills?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="sb-navbar navbar navbar-expand-lg">
        <div className="container py-1">

          {/* Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <div className="sb-brand-icon">
              <GraduationCap size={24} />
            </div>
            <span className="fw-bolder fs-4" style={{ letterSpacing: '-0.03em', color: '#0F172A' }}>
              Skill<span style={{ color: '#2563EB' }}>Bridge</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 align-items-center">
              {NAV_ITEMS.map(n => (
                <li key={n.to} className="nav-item">
                  <NavLink to={n.to} end={n.end} className="nav-link">{n.label}</NavLink>
                </li>
              ))}
            </ul>

            <div className="d-flex align-items-center gap-2">
              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="d-none d-lg-flex position-relative me-2" style={{ width: 200 }}>
                <Search size={15} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  className="form-control form-control-sm rounded-pill ps-5 border-0 shadow-none"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ fontSize: '0.825rem', paddingTop: '0.45rem', paddingBottom: '0.45rem', backgroundColor: '#F1F5F9' }}
                />
              </form>

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard/matches" className="btn btn-sm btn-outline-primary d-none d-md-inline-flex align-items-center gap-1">
                    <Users size={16} /><span>Matches</span>
                  </Link>
                  <Link to="/dashboard/messages" className="btn btn-light rounded-circle p-2 text-dark" title="Messages">
                    <MessageSquare size={18} />
                  </Link>

                  {/* Notifications */}
                  <div className="position-relative">
                    <button className="btn btn-light rounded-circle p-2 text-dark position-relative" onClick={() => setShowNotifMenu(!showNotifMenu)}>
                      <Bell size={18} />
                      {unreadCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {showNotifMenu && (
                      <div className="sb-card position-absolute end-0 mt-2 shadow-lg p-0" style={{ width: 320, zIndex: 1100, borderRadius: 12, overflow: 'hidden' }}>
                        <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                          <span className="fw-bold small text-dark">Notifications</span>
                          {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} className="btn btn-link btn-sm p-0 text-decoration-none small" style={{ fontSize: '0.75rem' }}>
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                          {notifications.length === 0 ? (
                            <div className="p-3 text-center text-muted small">No new notifications</div>
                          ) : notifications.map(n => (
                            <Link key={n.id} to={n.link || '/dashboard'} onClick={() => setShowNotifMenu(false)}
                              className={`p-3 d-block text-decoration-none border-bottom ${n.isRead ? 'bg-white' : 'bg-light'}`}>
                              <div className="fw-bold text-dark small mb-1">{n.title}</div>
                              <div className="text-muted small" style={{ fontSize: '0.8rem' }}>{n.message}</div>
                            </Link>
                          ))}
                        </div>
                        <div className="p-2 text-center bg-light">
                          <Link to="/dashboard/notifications" onClick={() => setShowNotifMenu(false)} className="small text-decoration-none fw-semibold">
                            View all notifications
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="position-relative">
                    <button className="btn p-0 border-0" onClick={() => setShowUserMenu(!showUserMenu)}>
                      <img
                        src={user?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`}
                        alt={user?.profile?.fullName || user?.username}
                        className="rounded-circle border"
                        style={{ width: 36, height: 36, objectFit: 'cover' }}
                      />
                    </button>
                    {showUserMenu && (
                      <div className="sb-card position-absolute end-0 mt-2 shadow-lg p-2" style={{ width: 230, zIndex: 1100, borderRadius: 12 }}>
                        <div className="px-3 py-2 border-bottom mb-1">
                          <div className="fw-bold text-dark text-truncate">{user?.profile?.fullName || user?.username}</div>
                          <div className="text-muted small text-truncate">@{user?.username}</div>
                          <span className="badge bg-primary-subtle text-primary mt-1" style={{ fontSize: '0.7rem' }}>{user?.role}</span>
                        </div>
                        <Link to="/dashboard"           onClick={() => setShowUserMenu(false)} className="dropdown-item py-2 px-3 rounded d-flex align-items-center gap-2 small"><User size={16} /> Dashboard</Link>
                        <Link to="/dashboard/exchanges" onClick={() => setShowUserMenu(false)} className="dropdown-item py-2 px-3 rounded d-flex align-items-center gap-2 small"><ArrowRightLeft size={16} /> Skill Exchanges</Link>
                        <Link to="/dashboard/sessions"  onClick={() => setShowUserMenu(false)} className="dropdown-item py-2 px-3 rounded d-flex align-items-center gap-2 small"><Calendar size={16} /> Sessions</Link>
                        {isMentor && <Link to="/mentor/dashboard" onClick={() => setShowUserMenu(false)} className="dropdown-item py-2 px-3 rounded d-flex align-items-center gap-2 small text-primary fw-semibold"><GraduationCap size={16} /> Mentor Portal</Link>}
                        {isAdmin  && <Link to="/admin/dashboard"  onClick={() => setShowUserMenu(false)} className="dropdown-item py-2 px-3 rounded d-flex align-items-center gap-2 small text-danger fw-semibold"><ShieldAlert size={16} /> Admin Panel</Link>}
                        <hr className="my-1" />
                        <button onClick={handleLogout} className="dropdown-item py-2 px-3 rounded d-flex align-items-center gap-2 small text-danger w-100 text-start border-0 bg-transparent">
                          <LogOut size={16} /> Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Link to="/login"    className="btn btn-sm btn-light rounded-pill text-dark fw-semibold px-3 py-1 border shadow-none" style={{ backgroundColor: '#FFF', fontSize: '0.88rem' }}>Login</Link>
                  <Link to="/register" className="btn btn-sm btn-primary rounded-pill fw-semibold px-3 py-1 shadow-sm" style={{ backgroundColor: '#1D4ED8', borderColor: '#1D4ED8', fontSize: '0.88rem' }}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button className="sb-hamburger d-lg-none" onClick={() => setMobileMenuOpen(o => !o)} aria-label="Menu">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ═══════ Mobile drawer ═══════ */}
      <div className={`sb-mobile-drawer ${mobileMenuOpen ? 'sb-mobile-drawer--open' : ''}`}>
        {/* Backdrop */}
        <div className="sb-drawer-backdrop" onClick={() => setMobileMenuOpen(false)} />

        <div className="sb-drawer-panel">
          {/* Header */}
          <div className="sb-drawer-header">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none" onClick={() => setMobileMenuOpen(false)}>
              <div className="sb-brand-icon sb-brand-icon-sm">
                <GraduationCap size={18} />
              </div>
              <span className="fw-bolder text-white" style={{ fontSize: '1.1rem', letterSpacing: '-0.03em' }}>
                Skill<span style={{ color: '#60A5FA' }}>Bridge</span>
              </span>
            </Link>
            <button className="sb-drawer-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close">
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="sb-drawer-search-wrap">
            <form onSubmit={handleSearchSubmit} className="sb-drawer-search">
              <Search size={15} className="sb-drawer-search-icon" />
              <input
                type="text"
                placeholder="Search skills, mentors…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="sb-drawer-search-input"
              />
              <button type="submit" className="sb-drawer-search-btn" aria-label="Search">
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

          {/* Live pill */}
          <div className="sb-drawer-live">
            <span className="sb-pulse-dot" />
            <Zap size={11} />
            <span>1,420 live exchanges right now</span>
          </div>

          {/* Nav links */}
          <nav className="sb-drawer-nav">
            {NAV_ITEMS.map((n, i) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) => `sb-drawer-link ${isActive ? 'sb-drawer-link--active' : ''}`}
                style={{ animationDelay: `${i * 45}ms` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{n.label}</span>
                <ArrowRight size={14} className="sb-drawer-link-arrow" />
              </NavLink>
            ))}
          </nav>

          {/* CTA or user info */}
          <div className="sb-drawer-footer">
            {isAuthenticated ? (
              <div className="sb-drawer-user">
                <img
                  src={user?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`}
                  alt={user?.username}
                  className="sb-drawer-avatar"
                />
                <div className="flex-grow-1 overflow-hidden">
                  <div className="text-white fw-semibold text-truncate" style={{ fontSize: '0.88rem' }}>{user?.profile?.fullName || user?.username}</div>
                  <div style={{ color: '#64748B', fontSize: '0.74rem' }}>@{user?.username}</div>
                </div>
                <button onClick={handleLogout} className="sb-drawer-logout" aria-label="Sign out">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login"    onClick={() => setMobileMenuOpen(false)} className="sb-drawer-btn-outline flex-fill text-center">Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="sb-drawer-btn-primary flex-fill text-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
