import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email.trim(), password);
      showToast(`Welcome back, ${user.profile?.fullName || user.username}!`, 'success');
      if (user.role === 'ADMIN' && from === '/dashboard') {
        navigate('/admin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-3">
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #2563EB 0%, #6366F1 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <Sparkles size={20} />
            </div>
            <span className="fw-bolder fs-4 text-dark" style={{ letterSpacing: '-0.03em' }}>
              Skill<span style={{ color: '#2563EB' }}>Bridge</span>
            </span>
          </Link>
          <h3 className="fw-extrabold text-dark mb-1">Welcome Back</h3>
          <p className="text-muted small">Sign in to your SkillBridge account to continue</p>
        </div>

        <div className="sb-card p-4 p-md-5 bg-white shadow-sm">
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 small p-2 mb-3">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-dark">Email or Username</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Mail size={16} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small fw-semibold text-dark mb-0">Password</label>
                <Link to="/forgot-password" className="small text-decoration-none" style={{ fontSize: '0.8rem' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 d-inline-flex align-items-center justify-content-center gap-2 fw-semibold mt-2"
              disabled={loading}
            >
              <LogIn size={18} />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick Demo Login Chips */}
          <div className="mt-4 pt-3 border-top">
            <span className="small text-muted fw-semibold d-block mb-2 text-center" style={{ fontSize: '0.72rem' }}>
              DEMO FAST LOGIN (CLICK TO PREFILL):
            </span>
            <div className="d-flex flex-wrap gap-1 justify-content-center">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@skillbridge.io', 'AdminSecurePassword2026!')}
                className="btn btn-xs btn-outline-danger border small py-1 px-2"
                style={{ fontSize: '0.75rem' }}
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('alex.morgan@example.com', 'Password123!')}
                className="btn btn-xs btn-outline-primary border small py-1 px-2"
                style={{ fontSize: '0.75rem' }}
              >
                🎓 Alex (Mentor)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('elena.design@example.com', 'Password123!')}
                className="btn btn-xs btn-outline-indigo border small py-1 px-2"
                style={{ fontSize: '0.75rem', borderColor: '#C7D2FE', color: '#4F46E5' }}
              >
                🎨 Elena (Design)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('liam.oc@example.com', 'Password123!')}
                className="btn btn-xs btn-outline-secondary border small py-1 px-2"
                style={{ fontSize: '0.75rem' }}
              >
                🎒 Liam (Student)
              </button>
            </div>
          </div>

          <div className="text-center mt-4 small text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="fw-bold text-primary text-decoration-none">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
