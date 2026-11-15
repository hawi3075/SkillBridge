import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Github,
  Twitter,
  Linkedin,
  MessageSquare,
  ArrowUp,
  Zap,
  Users,
  BookOpen,
  Star,
  Mail,
  ArrowRight,
  Globe,
  Heart,
  TrendingUp,
  Shield
} from 'lucide-react';

const STATS = [
  { icon: Users,     value: '24,000+', label: 'Active Learners'   },
  { icon: Zap,       value: '1,420+',  label: 'Live Exchanges'    },
  { icon: BookOpen,  value: '340+',    label: 'Skills Covered'    },
  { icon: Star,      value: '4.9 / 5', label: 'Avg. Rating'       },
];

const NAV_COLUMNS = [
  {
    heading: 'Platform',
    links: [
      { label: 'Browse Skills',   to: '/skills'      },
      { label: 'Find Mentors',    to: '/mentors'     },
      { label: 'How It Works',    to: '/how-it-works'},
      { label: 'Pricing',         to: '/pricing'     },
    ],
  },
  {
    heading: 'Community',
    links: [
      { label: 'Forums',          to: '/community'   },
      { label: 'Success Stories', to: '/stories'     },
      { label: 'Events',          to: '/events'      },
      { label: 'Blog',            to: '/blog'        },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',        to: '/about'       },
      { label: 'Careers',         to: '/careers'     },
      { label: 'Press Kit',       to: '/press'       },
      { label: 'Contact',         to: '/contact'     },
    ],
  },
];

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="modern-footer mt-auto">
      {/* Floating orbs */}
      <div className="footer-orb footer-orb-1" aria-hidden="true" />
      <div className="footer-orb footer-orb-2" aria-hidden="true" />

      <div className="container position-relative" style={{ zIndex: 1 }}>

        {/* ── Tier 1: Brand + Stats + Newsletter ─────────────────────────── */}
        <div className="footer-tier1 py-4">
          {/* Brand block */}
          <div className="footer-brand-block">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none mb-2">
              <div className="sb-brand-icon sb-brand-icon-sm">
                <GraduationCap size={18} />
              </div>
              <span className="fw-bold text-white" style={{ fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
                Skill<span style={{ color: '#60A5FA' }}>Bridge</span>
              </span>
            </Link>
            <p className="footer-tagline">
              The peer-to-peer learning exchange where every skill you share earns one back.
            </p>
            <div className="d-flex align-items-center gap-1 mt-2">
              <Globe size={12} style={{ color: '#38BDF8' }} />
              <span style={{ color: '#38BDF8', fontSize: '0.74rem', fontWeight: 500 }}>
                Available worldwide · 40+ languages
              </span>
            </div>
          </div>

          {/* Stats strip */}
          <div className="footer-stats-grid">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="footer-stat-card">
                <div className="footer-stat-icon">
                  <Icon size={15} />
                </div>
                <div>
                  <div className="footer-stat-value">{value}</div>
                  <div className="footer-stat-label">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter-block">
            <div className="d-flex align-items-center gap-2 mb-1">
              <Mail size={14} style={{ color: '#60A5FA' }} />
              <span className="text-white fw-semibold" style={{ fontSize: '0.88rem' }}>Weekly Digest</span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.78rem', marginBottom: '0.65rem' }}>
              New skills, featured mentors, and community picks — straight to your inbox.
            </p>
            {subscribed ? (
              <div className="footer-subscribed-msg">
                <Heart size={13} style={{ color: '#F472B6' }} />
                <span>You're in! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="footer-newsletter-input"
                />
                <button type="submit" className="footer-newsletter-btn" aria-label="Subscribe">
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Tier 2: Nav Columns + Socials ───────────────────────────────── */}
        <div
          className="border-top py-4 d-flex flex-column flex-lg-row gap-4 justify-content-between"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          {/* Nav columns */}
          <div className="d-flex flex-wrap gap-4 flex-grow-1">
            {NAV_COLUMNS.map(col => (
              <div key={col.heading} className="footer-nav-col">
                <div className="footer-col-heading">{col.heading}</div>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
                  {col.links.map(link => (
                    <li key={link.to}>
                      <Link to={link.to} className="footer-nav-link">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Socials + badges */}
          <div className="footer-social-block">
            <div className="footer-col-heading">Follow Us</div>
            <div className="d-flex gap-2 mb-3">
              <a href="https://github.com"   target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="GitHub">
                <Github size={15} />
              </a>
              <a href="https://twitter.com"  target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="Twitter">
                <Twitter size={15} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="LinkedIn">
                <Linkedin size={15} />
              </a>
              <Link to="/community" className="footer-social-btn" aria-label="Community">
                <MessageSquare size={15} />
              </Link>
            </div>
            <div className="footer-trust-badges">
              <div className="footer-trust-badge">
                <Shield size={11} />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="footer-trust-badge">
                <TrendingUp size={11} />
                <span>#1 Skill Exchange</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tier 3: Legal bar ───────────────────────────────────────────── */}
        <div
          className="border-top pt-3 pb-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2"
          style={{ borderColor: 'rgba(255,255,255,0.06)', fontSize: '0.74rem' }}
        >
          <div style={{ color: '#475569' }}>
            &copy; {new Date().getFullYear()} SkillBridge Inc. — Learn · Practice · Grow
          </div>

          <div className="footer-status-pill">
            <span className="pulse-dot" />
            <span>1,420+ Exchanges Active Right Now</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link to="/terms"   className="footer-legal-link">Terms</Link>
            <span style={{ color: '#1E293B' }}>·</span>
            <Link to="/privacy" className="footer-legal-link">Privacy</Link>
            <span style={{ color: '#1E293B' }}>·</span>
            <Link to="/cookies" className="footer-legal-link">Cookies</Link>
            <button onClick={scrollToTop} className="footer-back-to-top ms-2" aria-label="Back to top">
              <ArrowUp size={12} />
              <span>Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
