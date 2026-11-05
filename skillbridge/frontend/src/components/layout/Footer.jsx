import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Github,
  Twitter,
  Linkedin,
  MessageSquare,
  ShieldCheck,
  Heart,
  ArrowUp
} from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="modern-footer mt-auto py-3">
      <div className="container position-relative" style={{ zIndex: 1 }}>
        {/* Main Footer Navigation Columns */}
        <div className="row g-3 g-lg-4 mb-2">
          {/* Brand & Description */}
          <div className="col-lg-4 col-md-5">
            <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-2">
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 60%, #3B82F6 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)'
                }}
              >
                <GraduationCap size={17} />
              </div>
              <span className="fw-bold fs-5 text-white" style={{ letterSpacing: '-0.02em' }}>
                Skill<span style={{ color: '#60A5FA' }}>Bridge</span>
              </span>
            </Link>

            <p className="text-secondary mb-2" style={{ fontSize: '0.78rem', lineHeight: 1.45, maxWidth: '300px', color: '#94A3B8' }}>
              SkillBridge replaces isolated tutorials with active, 1-on-1 reciprocal learning exchanges. Teach what you master, learn what you love—without tuition barriers.
            </p>

            {/* Active Network Pulse Badge */}
            <div
              className="d-inline-flex align-items-center gap-2 px-2.5 py-1 rounded-pill mb-2.5"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#34D399',
                fontSize: '0.72rem'
              }}
            >
              <span className="pulse-dot" style={{ width: '6px', height: '6px' }}></span>
              <span className="fw-semibold">1,420+ Peer Exchanges Active Today</span>
            </div>

            {/* Social Buttons */}
            <div className="d-flex gap-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="GitHub">
                <Github size={14} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="Twitter">
                <Twitter size={14} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="LinkedIn">
                <Linkedin size={14} />
              </a>
              <Link to="/community" className="footer-social-btn" title="Community Hub" aria-label="Community">
                <MessageSquare size={14} />
              </Link>
            </div>
          </div>

          {/* Explore Skills */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold text-white mb-2" style={{ fontSize: '0.85rem', letterSpacing: '0.01em' }}>
              Explore & Learn
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-1 mb-0">
              <li><Link to="/skills" className="footer-link">Skills Catalog</Link></li>
              <li><Link to="/mentors" className="footer-link">Find Mentors</Link></li>
              <li><Link to="/dashboard/matches" className="footer-link">Smart Matching</Link></li>
              <li><Link to="/skills?category=cat-1" className="footer-link">Web Development</Link></li>
              <li><Link to="/skills?category=cat-3" className="footer-link">UI/UX Design</Link></li>
              <li><Link to="/community" className="footer-link">Community Hub</Link></li>
            </ul>
          </div>

          {/* How It Works */}
          <div className="col-lg-3 col-md-4 col-6">
            <h6 className="fw-bold text-white mb-2" style={{ fontSize: '0.85rem', letterSpacing: '0.01em' }}>
              How It Works
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-1 mb-0">
              <li><Link to="/how-it-works" className="footer-link">3-Step Exchange Process</Link></li>
              <li><Link to="/register" className="footer-link">Become a Peer Mentor</Link></li>
              <li><Link to="/how-it-works" className="footer-link">Conflict-Free Calendar</Link></li>
              <li><Link to="/how-it-works" className="footer-link">Verified Review Rules</Link></li>
              <li><Link to="/community" className="footer-link">Community Guidelines</Link></li>
            </ul>
          </div>

          {/* Company & Safety */}
          <div className="col-lg-3 col-md-12">
            <h6 className="fw-bold text-white mb-2" style={{ fontSize: '0.85rem', letterSpacing: '0.01em' }}>
              Company & Safety
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-1 mb-2">
              <li><Link to="/about" className="footer-link">About SkillBridge</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Support Team</Link></li>
              <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
            </ul>

            <div
              className="d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.72rem',
                color: '#CBD5E1'
              }}
            >
              <ShieldCheck size={13} color="#F59E0B" />
              <span>Verified peer exchanges & reviews</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-top pt-2 mt-2 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 text-secondary"
          style={{ borderColor: 'rgba(255, 255, 255, 0.08)', fontSize: '0.74rem' }}
        >
          <div style={{ color: '#94A3B8' }}>
            &copy; {new Date().getFullYear()} SkillBridge Inc. Built for collaborative learning.
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="d-none d-md-inline" style={{ color: '#94A3B8' }}>
              Made with <Heart size={12} className="text-danger d-inline" fill="#EF4444" /> for peer creators
            </span>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="btn btn-sm rounded-pill px-2.5 py-0.5 d-inline-flex align-items-center gap-1 border"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                color: '#E2E8F0',
                fontSize: '0.72rem'
              }}
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp size={11} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
