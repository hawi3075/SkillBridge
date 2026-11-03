import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
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
  ShieldAlert
} from 'lucide-react';

export const UserLayout = () => {
  const { user, isMentor, isAdmin } = useAuth();

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="row g-4">
          {/* Sidebar Navigation */}
          <div className="col-lg-3">
            <div className="sb-card p-3 bg-white sticky-top" style={{ top: '85px', zIndex: 10 }}>
              {/* User Mini Profile */}
              <div className="d-flex align-items-center gap-3 p-2 mb-3 border-bottom pb-3">
                <img
                  src={user?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                  alt={user?.profile?.fullName || user?.username}
                  className="rounded-circle border"
                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                />
                <div className="overflow-hidden">
                  <h6 className="fw-bold mb-0 text-dark text-truncate">{user?.profile?.fullName || user?.username}</h6>
                  <span className="text-muted small">@{user?.username}</span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="d-flex flex-column gap-1">
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
              </nav>
            </div>
          </div>

          {/* Main Dashboard Content Outlet */}
          <div className="col-lg-9">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
