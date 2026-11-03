import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './context/ToastContext';

// Layouts & Guards
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import UserLayout from './layouts/UserLayout';
import { ProtectedRoute, MentorRoute, AdminRoute } from './routes/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import ExploreSkillsPage from './pages/public/ExploreSkillsPage';
import SkillDetailPage from './pages/public/SkillDetailPage';
import FindMentorsPage from './pages/public/FindMentorsPage';
import UserProfilePage from './pages/public/UserProfilePage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import AboutUsPage from './pages/public/AboutUsPage';
import CommunityPage from './pages/public/CommunityPage';
import ContactUsPage from './pages/public/ContactUsPage';
import TermsPage from './pages/public/TermsPage';
import PrivacyPage from './pages/public/PrivacyPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Dashboard Pages
import UserDashboardPage from './pages/user/UserDashboardPage';
import MatchesPage from './pages/user/MatchesPage';
import ExchangesPage from './pages/user/ExchangesPage';
import SessionsPage from './pages/user/SessionsPage';
import ChatPage from './pages/user/ChatPage';
import ReviewsPage from './pages/user/ReviewsPage';
import ProfilePage from './pages/user/ProfilePage';
import NotificationsPage from './pages/user/NotificationsPage';

// Mentor & Admin Pages
import MentorDashboardPage from './pages/mentor/MentorDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// 404 Component
const NotFound = () => (
  <div className="py-5 bg-light min-vh-100 d-flex align-items-center text-center">
    <div className="container" style={{ maxWidth: '480px' }}>
      <h1 className="display-1 fw-extrabold text-primary mb-2">404</h1>
      <h4 className="fw-bold text-dark mb-2">Page Not Found</h4>
      <p className="text-muted small mb-4">The page you are looking for does not exist or has been moved.</p>
      <a href="/" className="btn btn-primary px-4">Return Home</a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="d-flex flex-column min-vh-100">
              <Navbar />
              <main className="flex-grow-1">
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/skills" element={<ExploreSkillsPage />} />
                  <Route path="/skills/:slug" element={<SkillDetailPage />} />
                  <Route path="/mentors" element={<FindMentorsPage />} />
                  <Route path="/users/:id" element={<UserProfilePage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/about" element={<AboutUsPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/contact" element={<ContactUsPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />

                  {/* Auth Pages */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />

                  {/* Protected User Dashboard Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<UserDashboardPage />} />
                    <Route path="matches" element={<MatchesPage />} />
                    <Route path="exchanges" element={<ExchangesPage />} />
                    <Route path="sessions" element={<SessionsPage />} />
                    <Route path="messages" element={<ChatPage />} />
                    <Route path="reviews" element={<ReviewsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                  </Route>

                  {/* Protected Mentor Portal */}
                  <Route
                    path="/mentor/dashboard"
                    element={
                      <MentorRoute>
                        <UserLayout />
                      </MentorRoute>
                    }
                  >
                    <Route index element={<MentorDashboardPage />} />
                  </Route>

                  {/* Protected Admin Portal */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminRoute>
                        <UserLayout />
                      </AdminRoute>
                    }
                  >
                    <Route index element={<AdminDashboardPage />} />
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </ToastProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
