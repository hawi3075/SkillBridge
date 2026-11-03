import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.resetPassword(token.trim(), newPassword);
      if (res.success) {
        showToast('Password reset successful! You can now log in.', 'success');
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
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
          <h3 className="fw-extrabold text-dark mb-1">Set New Password</h3>
          <p className="text-muted small">Choose a strong password to secure your account</p>
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
              <label className="form-label small fw-semibold text-dark">Reset Token</label>
              <input
                type="text"
                className="form-control font-monospace small"
                placeholder="Paste your reset token"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-dark">New Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0"
                  placeholder="At least 6 characters"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold text-dark">Confirm New Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0"
                  placeholder="Confirm password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/login" className="small text-muted text-decoration-none">
              Cancel & Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
