import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Github, Twitter, Linkedin, ArrowUp, Zap } from 'lucide-react';

const NAV = [
  { label: 'Skills',       to: '/skills'       },
  { label: 'Mentors',      to: '/mentors'      },
  { label: 'Community',    to: '/community'    },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'About',        to: '/about'        },
];

export const Footer = () => (
  <footer className="sb-footer mt-auto">
    <div className="container">

      {/* ── Single compact row ── */}
      <div className="sb-footer-row">

        {/* Brand */}
        <Link to="/" className="sb-footer-brand text-decoration-none">
          <div className="sb-brand-icon sb-brand-icon-sm">
            <GraduationCap size={15} />
          </div>
          <span>Skill<span>Bridge</span></span>
        </Link>

        {/* Live pulse badge */}
        <div className="sb-footer-live">
          <span className="sb-pulse-dot" />
          <Zap size={11} />
          <span>1,420 live exchanges</span>
        </div>

        {/* Nav */}
        <nav className="sb-footer-nav">
          {NAV.map(n => (
            <Link key={n.to} to={n.to} className="sb-footer-link">{n.label}</Link>
          ))}
        </nav>

        {/* Socials + back-to-top */}
        <div className="sb-footer-actions">
          <a href="https://github.com"   target="_blank" rel="noreferrer" className="sb-footer-icon" aria-label="GitHub">
            <Github size={14} />
          </a>
          <a href="https://twitter.com"  target="_blank" rel="noreferrer" className="sb-footer-icon" aria-label="Twitter">
            <Twitter size={14} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="sb-footer-icon" aria-label="LinkedIn">
            <Linkedin size={14} />
          </a>
          <button
            className="sb-footer-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
          >
            <ArrowUp size={12} />
          </button>
        </div>

      </div>

      {/* ── Micro legal strip ── */}
      <div className="sb-footer-legal">
        <span>© {new Date().getFullYear()} SkillBridge</span>
        <span className="sb-footer-dot" />
        <Link to="/terms"   className="sb-footer-legal-link">Terms</Link>
        <span className="sb-footer-dot" />
        <Link to="/privacy" className="sb-footer-legal-link">Privacy</Link>
      </div>

    </div>
  </footer>
);

export default Footer;
