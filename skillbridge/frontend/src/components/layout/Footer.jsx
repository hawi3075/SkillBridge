import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-top bg-white pt-5 pb-4">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none mb-3">
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #6366F1 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <Sparkles size={16} />
              </div>
              <span className="fw-bolder fs-5 text-dark" style={{ letterSpacing: '-0.03em' }}>
                Skill<span style={{ color: '#2563EB' }}>Bridge</span>
              </span>
            </Link>
            <p className="text-muted small mb-4" style={{ lineHeight: 1.6, maxWidth: '320px' }}>
              SkillBridge is a peer-learning marketplace connecting passionate learners and mentors worldwide. Teach what you know, learn what you love—together.
            </p>
            <div className="d-flex gap-3 text-muted">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted text-hover-primary" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted text-hover-primary" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted text-hover-primary" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold text-dark mb-3">Marketplace</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/skills" className="text-muted text-decoration-none">Explore Skills</Link></li>
              <li><Link to="/mentors" className="text-muted text-decoration-none">Find Mentors</Link></li>
              <li><Link to="/dashboard/matches" className="text-muted text-decoration-none">Smart Matching</Link></li>
              <li><Link to="/community" className="text-muted text-decoration-none">Community Hub</Link></li>
            </ul>
          </div>

          {/* How & Why */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold text-dark mb-3">Learn & Teach</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/how-it-works" className="text-muted text-decoration-none">How It Works</Link></li>
              <li><Link to="/register" className="text-muted text-decoration-none">Become a Mentor</Link></li>
              <li><Link to="/about" className="text-muted text-decoration-none">About Us</Link></li>
              <li><Link to="/contact" className="text-muted text-decoration-none">Contact Support</Link></li>
            </ul>
          </div>

          {/* Legal & Safety */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold text-dark mb-3">Community Trust & Safety</h6>
            <p className="text-muted small mb-3">
              We cultivate a respectful, verified environment where mutual peer exchange is safe, transparent, and rewarding for all creators.
            </p>
            <div className="d-flex gap-3 small">
              <Link to="/terms" className="text-muted text-decoration-none">Terms of Service</Link>
              <span>•</span>
              <Link to="/privacy" className="text-muted text-decoration-none">Privacy Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-top pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-muted small">
          <div>
            &copy; {new Date().getFullYear()} SkillBridge Inc. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-1">
            Built with modern technology for peer learning.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
