import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, Heart, Shield, Target, Users } from 'lucide-react';

export const AboutUsPage = () => {
  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Hero */}
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">Our Mission</span>
          <h1 className="fw-extrabold text-dark mb-3">Democratizing Global Education Through Peer Exchange</h1>
          <p className="text-muted mx-auto lead" style={{ maxWidth: '680px' }}>
            SkillBridge was founded on a simple conviction: everybody knows something valuable, and everybody wants to learn something new.
          </p>
        </div>

        {/* Story Section */}
        <div className="sb-card p-4 p-md-5 bg-white mb-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h3 className="fw-bold text-dark mb-3">The Problem With Modern Learning</h3>
              <p className="text-muted" style={{ lineHeight: 1.7 }}>
                Traditional online courses have a notorious 90%+ dropout rate. Learners spend hundreds or thousands of dollars on generic recorded lectures with zero personalized feedback, zero accountability, and no one to answer their specific questions.
              </p>
              <p className="text-muted" style={{ lineHeight: 1.7 }}>
                Meanwhile, millions of software developers, product designers, marketers, and linguists possess rich, practical expertise that they’d gladly trade for hands-on mentorship in another discipline. SkillBridge builds that bridge.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="p-4 bg-light rounded-4 border">
                <h5 className="fw-bold text-dark mb-3">Our Core Principles</h5>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                  <li className="d-flex align-items-start gap-2">
                    <span className="p-1 bg-primary text-white rounded-circle"><Sparkles size={14} /></span>
                    <div>
                      <strong className="text-dark">Radical Accessibility:</strong> Quality 1-on-1 education should never depend on financial privilege.
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <span className="p-1 bg-indigo text-white rounded-circle" style={{ backgroundColor: '#6366F1' }}><Heart size={14} /></span>
                    <div>
                      <strong className="text-dark">Reciprocal Growth:</strong> Mutual teaching creates deeper empathy, stronger mastery, and authentic relationships.
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <span className="p-1 bg-success text-white rounded-circle"><Shield size={14} /></span>
                    <div>
                      <strong className="text-dark">Trust & Safety:</strong> Verified reviews, transparent scoring, and active moderation protect our global community.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Milestones */}
        <div className="row g-4 text-center mb-5">
          <div className="col-md-4">
            <div className="sb-card p-4 bg-white h-100">
              <h2 className="fw-extrabold text-primary mb-1">45+</h2>
              <div className="text-dark fw-bold mb-1">Countries Represented</div>
              <p className="text-muted small mb-0">Cross-cultural exchanges happening across multiple continents daily.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="sb-card p-4 bg-white h-100">
              <h2 className="fw-extrabold text-primary mb-1">98.2%</h2>
              <div className="text-dark fw-bold mb-1">Positive Satisfaction Rate</div>
              <p className="text-muted small mb-0">Based on verified post-session reviews left by genuine learners.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="sb-card p-4 bg-white h-100">
              <h2 className="fw-extrabold text-primary mb-1">100%</h2>
              <div className="text-dark fw-bold mb-1">Peer Powered</div>
              <p className="text-muted small mb-0">Driven by real human connection rather than automated robotic transcripts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
