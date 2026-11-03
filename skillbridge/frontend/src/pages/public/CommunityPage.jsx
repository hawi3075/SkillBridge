import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Sparkles, BookOpen, Heart, ArrowRight } from 'lucide-react';

export const CommunityPage = () => {
  const hubs = [
    {
      title: 'Frontend & UI Engineering',
      desc: 'Discussing React 18, Tailwind CSS, TypeScript strict patterns, and design systems.',
      members: 420,
      icon: '💻'
    },
    {
      title: 'UI/UX & Product Design',
      desc: 'Critiques, Figma tips, customer journey maps, and portfolio teardowns.',
      members: 310,
      icon: '🎨'
    },
    {
      title: 'Language & Culture Exchange',
      desc: 'Pairing native speakers for conversational Spanish, Japanese, French, and English.',
      members: 580,
      icon: '🌍'
    },
    {
      title: 'Data Science & Machine Learning',
      desc: 'Python, Pandas, PyTorch models, and real-world predictive analysis pipelines.',
      members: 275,
      icon: '📊'
    }
  ];

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">Global Community</span>
          <h1 className="fw-extrabold text-dark mb-2">Connect With Like-Minded Creators</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            SkillBridge is more than an exchange tool—it’s an open network of ambitious creators, engineers, designers, and educators.
          </p>
        </div>

        {/* Hubs Grid */}
        <div className="row g-4 mb-5">
          {hubs.map((hub, idx) => (
            <div key={idx} className="col-md-6">
              <div className="sb-card p-4 h-100 bg-white">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{ fontSize: '2rem' }}>{hub.icon}</div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">{hub.title}</h5>
                    <span className="text-muted small">{hub.members} Active Members</span>
                  </div>
                </div>
                <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>
                  {hub.desc}
                </p>
                <Link to="/skills" className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1">
                  <span>Explore Topic</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Guidelines */}
        <div className="sb-card p-4 p-md-5 bg-white">
          <h4 className="fw-bold text-dark mb-3">Community Code of Conduct</h4>
          <div className="row g-4 text-muted small" style={{ lineHeight: 1.6 }}>
            <div className="col-md-4">
              <h6 className="fw-bold text-dark">1. Be Punctual and Respectful</h6>
              <p>Honor scheduled learning sessions. If an unexpected conflict arises, communicate early and reschedule via the platform.</p>
            </div>
            <div className="col-md-4">
              <h6 className="fw-bold text-dark">2. Cultivate a Safe Space</h6>
              <p>Zero tolerance for harassment, discrimination, or abusive language. Every learner deserves encouragement and patient guidance.</p>
            </div>
            <div className="col-md-4">
              <h6 className="fw-bold text-dark">3. Give Constructive Feedback</h6>
              <p>Leave fair, specific, and actionable reviews following completed exchanges to help fellow peers grow.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
