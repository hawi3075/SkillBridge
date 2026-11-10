import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Github,
  Twitter,
  Linkedin,
  MessageSquare,
  ArrowUp
} from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="modern-footer mt-auto py-3">
      <div className="container position-relative" style={{ zIndex: 1 }}>
        {/* Tier 1: Brand, Navigation Pills & Actions */}
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 mb-2 pb-1">
          {/* Brand & Slogan */}
          <div className="d-flex align-items-center gap-2">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
              <div className="sb-brand-icon sb-brand-icon-sm">
                <GraduationCap size={16} />
              </div>
              <span className="fw-bold fs-5 text-white" style={{ letterSpacing: '-0.02em' }}>
                Skill<span style={{ color: '#60A5FA' }}>Bridge</span>
              </span>
            </Link>
            <span className="text-secondary small d-none d-sm-inline" style={{ color: '#64748B', fontSize: '0.78rem' }}>
              • Peer Learning Exchange
            </span>
          </div>

          {/* Horizontal Nav Links */}
          <nav className="d-flex flex-wrap justify-content-center align-items-center gap-1">
            <Link to="/skills" className="footer-nav-link">Skills</Link>
            <Link to="/mentors" className="footer-nav-link">Mentors</Link>
            <Link to="/how-it-works" className="footer-nav-link">How It Works</Link>
            <Link to="/community" className="footer-nav-link">Community</Link>
            <Link to="/about" className="footer-nav-link">About</Link>
            <Link to="/contact" className="footer-nav-link">Contact</Link>
          </nav>

          {/* Socials & Back To Top */}
          <div className="d-flex align-items-center gap-2">
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
            <button onClick={scrollToTop} className="footer-back-to-top ms-1" aria-label="Back to top">
              <ArrowUp size={12} />
              <span>Top</span>
            </button>
          </div>
        </div>

        {/* Tier 2: Legal, Copyright & Live Status */}
        <div
          className="border-top pt-2 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-secondary"
          style={{ borderColor: 'rgba(255, 255, 255, 0.06)', fontSize: '0.74rem' }}
        >
          <div style={{ color: '#64748B' }}>
            &copy; {new Date().getFullYear()} SkillBridge Inc. Learn • Practice • Grow.
          </div>

          {/* Active Network Pulse Badge */}
          <div className="footer-status-pill">
            <span className="pulse-dot"></span>
            <span>1,420+ Exchanges Active Today</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link to="/terms" className="text-decoration-none" style={{ color: '#64748B', fontSize: '0.74rem' }}>
              Terms
            </Link>
            <span style={{ color: '#334155' }}>•</span>
            <Link to="/privacy" className="text-decoration-none" style={{ color: '#64748B', fontSize: '0.74rem' }}>
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
