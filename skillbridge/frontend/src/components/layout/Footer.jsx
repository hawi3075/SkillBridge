import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import {
  GraduationCap,
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Heart,
  ArrowUp,
  Send,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe,
  MessageSquare,
  BookOpen
} from 'lucide-react';

export const Footer = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setSubscribed(true);
    showToast('Welcome to the SkillBridge community! 🚀 Weekly digest incoming.', 'success');
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="modern-footer mt-auto pt-5 pb-4">
      <div className="container position-relative" style={{ zIndex: 1 }}>
        {/* Pre-Footer Action / Newsletter Card */}
        <div className="footer-newsletter-card p-4 p-md-5 mb-5 text-white">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', fontSize: '0.8rem', fontWeight: 600 }}>
                <Sparkles size={14} color="#FCD34D" />
                <span>Join The Reciprocal Learning Movement</span>
              </div>
              <h3 className="fw-extrabold mb-2" style={{ letterSpacing: '-0.02em', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
                Never Stop Learning. <br />Never Stop Teaching.
              </h3>
              <p className="mb-0 text-white-50" style={{ maxWidth: '500px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Get our weekly curated digest of trending skills, high-compatibility match recommendations, and peer tutoring strategies.
              </p>
            </div>

            <div className="col-lg-5">
              {subscribed ? (
                <div className="p-3 rounded-4 bg-white text-dark d-flex align-items-center gap-3 shadow-lg">
                  <div className="rounded-circle p-2 bg-success text-white">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">You&apos;re on the list! 🎉</h6>
                    <span className="small text-muted">Check your inbox for our curated starter guide.</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="bg-white p-2 rounded-pill shadow-lg d-flex align-items-center">
                  <input
                    type="email"
                    className="form-control border-0 shadow-none ps-3 text-dark"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ fontSize: '0.9rem', backgroundColor: 'transparent' }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 flex-shrink-0 fw-semibold"
                    style={{ backgroundColor: '#1D4ED8', borderColor: '#1D4ED8', fontSize: '0.9rem' }}
                  >
                    <span>Subscribe</span>
                    <Send size={14} />
                  </button>
                </form>
              )}

              <div className="d-flex flex-wrap gap-3 mt-3 text-white-50 small" style={{ fontSize: '0.75rem' }}>
                <span className="d-inline-flex align-items-center gap-1">
                  <ShieldCheck size={14} color="#34D399" /> 100% Free • No Spam
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <Zap size={14} color="#FCD34D" /> Unsubscribe anytime
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="p-3 px-4 rounded-4 mb-5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="row text-center g-3">
            <div className="col-6 col-md-3 border-end border-secondary border-opacity-25">
              <div className="fw-extrabold fs-5 text-white">15,000+</div>
              <div className="text-secondary small" style={{ fontSize: '0.75rem' }}>Active Learners</div>
            </div>
            <div className="col-6 col-md-3 border-end border-secondary border-opacity-25">
              <div className="fw-extrabold fs-5 text-primary">2,400+</div>
              <div className="text-secondary small" style={{ fontSize: '0.75rem' }}>Completed Sessions</div>
            </div>
            <div className="col-6 col-md-3 border-end border-secondary border-opacity-25">
              <div className="fw-extrabold fs-5 text-warning">4.9 / 5.0</div>
              <div className="text-secondary small" style={{ fontSize: '0.75rem' }}>Average Rating</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="fw-extrabold fs-5 text-success">100% Free</div>
              <div className="text-secondary small" style={{ fontSize: '0.75rem' }}>Direct Peer Exchange</div>
            </div>
          </div>
        </div>

        {/* Main Footer Navigation Columns */}
        <div className="row g-4 mb-5">
          {/* Brand & Description */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none mb-3">
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 60%, #3B82F6 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
                }}
              >
                <GraduationCap size={22} />
              </div>
              <span className="fw-bolder fs-4 text-white" style={{ letterSpacing: '-0.03em' }}>
                Skill<span style={{ color: '#60A5FA' }}>Bridge</span>
              </span>
            </Link>

            <p className="text-secondary small mb-3" style={{ lineHeight: 1.7, maxWidth: '340px', color: '#94A3B8' }}>
              SkillBridge replaces isolated tutorials with active, 1-on-1 reciprocal learning exchanges. Teach what you master, learn what you love—without tuition barriers.
            </p>

            {/* Active Network Pulse Badge */}
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#34D399',
                fontSize: '0.78rem'
              }}
            >
              <span className="pulse-dot"></span>
              <span className="fw-semibold">1,420+ Peer Exchanges Active Today</span>
            </div>

            {/* Social Buttons */}
            <div className="d-flex gap-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="GitHub">
                <Github size={17} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="Twitter">
                <Twitter size={17} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="LinkedIn">
                <Linkedin size={17} />
              </a>
              <Link to="/community" className="footer-social-btn" title="Community Hub" aria-label="Community">
                <MessageSquare size={17} />
              </Link>
            </div>
          </div>

          {/* Explore Skills */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold text-white mb-3" style={{ fontSize: '0.95rem', letterSpacing: '0.02em' }}>
              Explore & Learn
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/skills" className="footer-link">Skills Catalog</Link></li>
              <li><Link to="/mentors" className="footer-link">Find Mentors</Link></li>
              <li><Link to="/dashboard/matches" className="footer-link">Smart Matching</Link></li>
              <li><Link to="/skills?category=cat-1" className="footer-link">Web Development</Link></li>
              <li><Link to="/skills?category=cat-3" className="footer-link">UI/UX Design</Link></li>
              <li><Link to="/community" className="footer-link">Community Hub</Link></li>
            </ul>
          </div>

          {/* How It Works */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="fw-bold text-white mb-3" style={{ fontSize: '0.95rem', letterSpacing: '0.02em' }}>
              How It Works
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/how-it-works" className="footer-link">3-Step Exchange Process</Link></li>
              <li><Link to="/register" className="footer-link">Become a Peer Mentor</Link></li>
              <li><Link to="/how-it-works" className="footer-link">Conflict-Free Calendar</Link></li>
              <li><Link to="/how-it-works" className="footer-link">Verified Review Rules</Link></li>
              <li><Link to="/community" className="footer-link">Community Guidelines</Link></li>
            </ul>
          </div>

          {/* Company & Trust */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white mb-3" style={{ fontSize: '0.95rem', letterSpacing: '0.02em' }}>
              Company & Safety
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-3">
              <li><Link to="/about" className="footer-link">About SkillBridge</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Support Team</Link></li>
              <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
            </ul>

            <div
              className="p-3 rounded-3"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div className="d-flex align-items-center gap-2 text-warning mb-1 small fw-semibold">
                <ShieldCheck size={16} /> Verified Platform
              </div>
              <p className="text-secondary small mb-0" style={{ fontSize: '0.78rem', lineHeight: 1.5, color: '#94A3B8' }}>
                All reviews are verified after completed sessions with zero duplicate or hallucinated ratings.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-top pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-secondary small"
          style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
        >
          <div style={{ color: '#94A3B8' }}>
            &copy; {new Date().getFullYear()} SkillBridge Inc. Built for collaborative learning.
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="d-none d-sm-inline" style={{ color: '#94A3B8' }}>
              Made with <Heart size={14} className="text-danger d-inline" fill="#EF4444" /> for peer creators worldwide
            </span>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="btn btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 border"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                color: '#E2E8F0',
                fontSize: '0.78rem'
              }}
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;