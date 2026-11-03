import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetData, setResetData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email.trim());
      if (res.success) {
        setResetData(res.data);
        showToast('Password reset instructions generated', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Error requesting reset', 'error');
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
          <h3 className="fw-extrabold text-dark mb-1">Reset Password</h3>
          <p className="text-muted small">Enter your account email to receive reset instructions</p>
        </div>

        <div className="sb-card p-4 p-md-5 bg-white shadow-sm">
          {resetData ? (
            <div>
              <div className="alert alert-success d-flex align-items-start gap-2 small p-3 mb-3">
                <CheckCircle2 size={18} className="mt-1 flex-shrink-0" />
                <div>
                  <strong>Reset Token Generated!</strong>
                  <div className="mt-1 text-break">
                    For local testing and security verification, your secure token is:
                    <div className="bg-white p-2 rounded border font-monospace mt-2 small text-dark">
                      {resetData.resetToken}
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to={`/reset-password?token=${resetData.resetToken}`}
                className="btn btn-primary w-100 py-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-2 mb-3"
              >
                <KeyRound size={16} />
                <span>Proceed to Set New Password</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-semibold text-dark">Account Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="text-center mt-4">
            <Link to="/login" className="small text-muted text-decoration-none d-inline-flex align-items-center gap-1">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
