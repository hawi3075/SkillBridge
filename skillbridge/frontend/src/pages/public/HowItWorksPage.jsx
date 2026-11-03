import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, X, Shield, Users, Clock, Video, Star } from 'lucide-react';

export const HowItWorksPage = () => {
  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">The Philosophy</span>
          <h1 className="fw-extrabold text-dark mb-2">How SkillBridge Works</h1>
          <p className="text-muted mx-auto lead" style={{ maxWidth: '640px' }}>
            We believe knowledge shouldn’t be locked behind high price tags. When two motivated people share what they know, everyone wins.
          </p>
        </div>

        {/* 4 Core Workflow Pillars */}
        <div className="row g-4 mb-5">
          <div className="col-md-6 col-lg-3">
            <div className="sb-card p-4 h-100 bg-white">
              <div
                className="mb-3 rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: '48px', height: '48px', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 700 }}
              >
                01
              </div>
              <h5 className="fw-bold text-dark mb-2">Build Your Inventory</h5>
              <p className="text-muted small" style={{ lineHeight: 1.6 }}>
                List your core competencies and what you want to master next. Detail your experience level and preferred session windows.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="sb-card p-4 h-100 bg-white">
              <div
                className="mb-3 rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: '48px', height: '48px', backgroundColor: '#EEF2FF', color: '#6366F1', fontWeight: 700 }}
              >
                02
              </div>
              <h5 className="fw-bold text-dark mb-2">Algorithmic Matching</h5>
              <p className="text-muted small" style={{ lineHeight: 1.6 }}>
                Our transparent matching algorithm evaluates skill complementarity, language compatibility, time zones, and user ratings.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="sb-card p-4 h-100 bg-white">
              <div
                className="mb-3 rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: '48px', height: '48px', backgroundColor: '#ECFDF5', color: '#10B981', fontWeight: 700 }}
              >
                03
              </div>
              <h5 className="fw-bold text-dark mb-2">Collaborative Sessions</h5>
              <p className="text-muted small" style={{ lineHeight: 1.6 }}>
                Send proposals, chat in real-time, and schedule 1-on-1 sessions. SkillBridge generates automatic video links and handles conflict prevention.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="sb-card p-4 h-100 bg-white">
              <div
                className="mb-3 rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: '48px', height: '48px', backgroundColor: '#FEF3C7', color: '#D97706', fontWeight: 700 }}
              >
                04
              </div>
              <h5 className="fw-bold text-dark mb-2">Reviews & Reputation</h5>
              <p className="text-muted small" style={{ lineHeight: 1.6 }}>
                Rate your peer after each completed session. Honest reviews ensure platform trust and motivate high-quality guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="sb-card p-4 p-md-5 bg-white mb-5">
          <div className="text-center mb-4">
            <h3 className="fw-extrabold text-dark mb-2">Why Peer Exchange Beats Traditional Courses</h3>
            <p className="text-muted">A modern approach designed for active creators, developers, and practitioners.</p>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr className="border-bottom">
                  <th style={{ width: '35%' }} className="text-muted small">FEATURE</th>
                  <th style={{ width: '32%' }} className="text-muted small">TRADITIONAL BOOTCAMPS</th>
                  <th style={{ width: '33%' }} className="text-primary small fw-bold">SKILLBRIDGE PLATFORM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-semibold text-dark">Cost & Pricing</td>
                  <td className="text-muted">$1,500 – $15,000+ tuition fees</td>
                  <td className="fw-bold text-success">
                    <Check size={18} className="me-1 text-success" /> $0 Free Peer Exchange
                  </td>
                </tr>
                <tr>
                  <td className="fw-semibold text-dark">Learning Format</td>
                  <td className="text-muted">Pre-recorded videos with passive watching</td>
                  <td className="fw-bold text-dark">
                    <Check size={18} className="me-1 text-success" /> 1-on-1 Interactive Tutoring
                  </td>
                </tr>
                <tr>
                  <td className="fw-semibold text-dark">Scheduling Flexibility</td>
                  <td className="text-muted">Rigid schedules or no feedback</td>
                  <td className="fw-bold text-dark">
                    <Check size={18} className="me-1 text-success" /> Mutually Agreed Flexible Times
                  </td>
                </tr>
                <tr>
                  <td className="fw-semibold text-dark">Personalized Answers</td>
                  <td className="text-muted">Lost in huge Discord or forum channels</td>
                  <td className="fw-bold text-dark">
                    <Check size={18} className="me-1 text-success" /> Dedicated Real-Time Pair Learning
                  </td>
                </tr>
                <tr>
                  <td className="fw-semibold text-dark">Mutual Accountability</td>
                  <td className="text-muted">Less than 10% course completion rate</td>
                  <td className="fw-bold text-dark">
                    <Check size={18} className="me-1 text-success" /> High accountability through peer exchange
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-4">
          <Link to="/register" className="btn btn-primary btn-lg px-4 me-3">
            Start Learning for Free
          </Link>
          <Link to="/skills" className="btn btn-outline-primary btn-lg px-4">
            Explore All Skills
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
