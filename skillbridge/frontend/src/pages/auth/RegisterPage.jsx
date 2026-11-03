import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Mail, Lock, User, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'USER',
    isMentor: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      showToast('Registration successful! Welcome to SkillBridge.', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container" style={{ maxWidth: '480px' }}>
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
          <h3 className="fw-extrabold text-dark mb-1">Create Your Account</h3>
          <p className="text-muted small">Join our global peer-learning and skill-exchange community</p>
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
              <label className="form-label small fw-semibold text-dark">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="e.g. Alex Morgan"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-dark">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. alex_dev"
                required
                minLength={3}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-dark">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className="form-control border-start-0"
                  placeholder="alex@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-dark">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {/* Role / Intention selection */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-dark mb-2">What is your primary goal?</label>
              <div className="row g-2">
                <div className="col-6">
                  <div
                    className={`p-3 border rounded-3 text-center cursor-pointer ${formData.role === 'USER' ? 'border-primary bg-primary-subtle' : 'bg-light'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setFormData({ ...formData, role: 'USER', isMentor: false })}
                  >
                    <div className="fw-bold small text-dark mb-1">Peer Learner</div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>Exchange & trade skills</div>
                  </div>
                </div>

                <div className="col-6">
                  <div
                    className={`p-3 border rounded-3 text-center cursor-pointer ${formData.role === 'MENTOR' ? 'border-primary bg-primary-subtle' : 'bg-light'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setFormData({ ...formData, role: 'MENTOR', isMentor: true })}
                  >
                    <div className="fw-bold small text-dark mb-1">Mentor</div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>Offer dedicated teaching</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 d-inline-flex align-items-center justify-content-center gap-2 fw-semibold"
              disabled={loading}
            >
              <UserPlus size={18} />
              <span>{loading ? 'Creating Account...' : 'Get Started Free'}</span>
            </button>
          </form>

          <div className="text-center mt-4 small text-muted">
            Already have an account?{' '}
            <Link to="/login" className="fw-bold text-primary text-decoration-none">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
