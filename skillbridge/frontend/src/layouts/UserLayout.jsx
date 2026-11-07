import React from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  ArrowRightLeft,
  Calendar,
  MessageSquare,
  Star,
  User,
  Bell,
  GraduationCap,
  ShieldAlert,
  ArrowLeft,
  BookOpen,
  Database,
  Users
} from 'lucide-react';

export const UserLayout = () => {
  const { user, isMentor, isAdmin } = useAuth();
  const location = useLocation();
  const isAdminView = location.pathname.startsWith('/admin');

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className={isAdminView ? 'container-fluid px-3 px-xl-4' : 'container'}>
        <div className="row g-4">
          {/* Sidebar Navigation */}
          <div className={isAdminView ? 'col-lg-3 col-xl-2' : 'col-lg-3'}>
            <div className="sb-card p-3 bg-white sticky-top" style={{ top: '85px', zIndex: 10 }}>
              {/* User Mini Profile */}
              <div className="d-flex align-items-center gap-3 p-2 mb-3 border-bottom pb-3">
                <img
                  src={user?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                  alt={user?.profile?.fullName || user?.username}
                  className="rounded-circle border"
                  style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                />
                <div className="overflow-hidden">
                  <h6 className="fw-bold mb-0 text-dark text-truncate" style={{ fontSize: '0.92rem' }}>
                    {user?.profile?.fullName || user?.username}
                  </h6>
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>@{user?.username}</span>
                  {isAdminView && (
                    <div className="mt-1">
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                        ADMINISTRATOR
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="d-flex flex-column gap-1">
                {isAdminView ? (
                  // Dedicated Admin Navigation
                  <>
                    <NavLink to="/admin/dashboard" end className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                      <ShieldAlert size={18} />
                      <span>Admin Console</span>
                    </NavLink>

                    <div className="pt-2 mt-2 border-top">
                      <span className="text-muted text-uppercase fw-bold px-2 d-block mb-1" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>
                        Navigation & Switcher
                      </span>
                      <Link to="/dashboard" className="sidebar-nav-item text-primary fw-semibold">
                        <ArrowLeft size={16} />
                        <span>Learner Portal</span>
                      </Link>

                      {isMentor && (
                        <Link to="/mentor/dashboard" className="sidebar-nav-item">
                          <GraduationCap size={16} />
                          <span>Mentor Portal</span>
                        </Link>
                      )}

                      <Link to="/skills" className="sidebar-nav-item">
                        <BookOpen size={16} />
                        <span>Public Catalog</span>
                      </Link>
                    </div>

                    {/* System Status Mini Widget */}
                    <div className="mt-3 p-2.5 rounded-3 bg-light border" style={{ fontSize: '0.72rem' }}>
                      <div className="d-flex align-items-center gap-1.5 text-success fw-bold mb-1">
                        <span className="pulse-dot" style={{ width: '6px', height: '6px' }}></span>
                        <span>Neon DB Live</span>
                      </div>
                      <div className="text-muted">PostgreSQL 16 Tables</div>
                    </div>
                  </>
                ) : (
                  // Standard Learner Navigation
                  <>
                    <NavLink to="/dashboard" end className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                      <LayoutDashboard size={18} />
                      <span>Overview</span>
                    </NavLink>

                    <NavLink to="/dashboard/matches" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                      <Sparkles size={18} color="#2563EB" />
                      <span>Smart Matches</span>
                    </NavLink>

                    <NavLink to="/dashboard/exchanges" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                      <ArrowRightLeft size={18} />
                      <span>Skill Exchanges</span>
                    </NavLink>

                    <NavLink to="/dashboard/sessions" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                      <Calendar size={18} />
                      <span>Learning Sessions</span>
                    </NavLink>

                    <NavLink to="/dashboard/messages" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                      <MessageSquare size={18} />
                      <span>Messages & Chat</span>
                    </NavLink>

                    <NavLink to="/dashboard/reviews" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                      <Star size={18} />
                      <span>Reviews & Ratings</span>
                    </NavLink>

                    <NavLink to="/dashboard/profile" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                      <User size={18} />
                      <span>Profile & Skills</span>
                    </NavLink>

                    <NavLink to="/dashboard/notifications" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                      <Bell size={18} />
                      <span>Notifications</span>
                    </NavLink>

                    {isMentor && (
                      <NavLink to="/mentor/dashboard" className={({ isActive }) => `sidebar-nav-item text-primary fw-semibold mt-2 border-top pt-2 ${isActive ? 'active' : ''}`}>
                        <GraduationCap size={18} />
                        <span>Mentor Portal</span>
                      </NavLink>
                    )}

                    {isAdmin && (
                      <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-nav-item text-danger fw-semibold mt-1 ${isActive ? 'active' : ''}`}>
                        <ShieldAlert size={18} />
                        <span>Admin Panel</span>
                      </NavLink>
                    )}
                  </>
                )}
              </nav>
            </div>
          </div>

          {/* Main Dashboard Content Outlet */}
          <div className={isAdminView ? 'col-lg-9 col-xl-10' : 'col-lg-9'}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
