import React from 'react';
import { Link } from 'react-router-dom';

export const TermsPage = () => {
  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="sb-card p-4 p-md-5 bg-white">
          <h1 className="fw-extrabold text-dark mb-2">Terms and Conditions</h1>
          <div className="text-muted small mb-4">Last Updated: November 2026</div>

          <div className="text-muted small" style={{ lineHeight: 1.8 }}>
            <h5 className="fw-bold text-dark mt-4">1. Acceptance of Terms</h5>
            <p>
              By accessing and creating an account on SkillBridge, you agree to comply with and be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
            </p>

            <h5 className="fw-bold text-dark mt-4">2. The Skill-Exchange Concept</h5>
            <p>
              SkillBridge operates as a peer-to-peer knowledge sharing and learning marketplace. Users agree to participate in reciprocal skill exchanges in good faith, offering accurate descriptions of their proficiencies and honoring scheduled session times.
            </p>

            <h5 className="fw-bold text-dark mt-4">3. User Conduct & Prohibited Content</h5>
            <p>
              You agree not to post false, misleading, defamatory, offensive, or infringing material. Any harassment, spamming, promotion of unauthorized third-party services, or abusive behavior will result in immediate suspension or termination of your account by platform administrators.
            </p>

            <h5 className="fw-bold text-dark mt-4">4. Session Scheduling & Punctuality</h5>
            <p>
              Users are responsible for attending sessions they confirm. If you need to reschedule or cancel a session, you must do so reasonably in advance via the dashboard so that your peer partner can adjust their plans.
            </p>

            <h5 className="fw-bold text-dark mt-4">5. Reviews & Ratings</h5>
            <p>
              Reviews may only be submitted following verified completed exchanges. Fabricated, retaliatory, or inappropriate reviews will be moderated or removed by our administration team.
            </p>

            <h5 className="fw-bold text-dark mt-4">6. Limitation of Liability</h5>
            <p>
              SkillBridge provides the matching and collaboration infrastructure but is not liable for direct disputes between participants outside the platform's terms of service.
            </p>
          </div>

          <div className="mt-5 pt-3 border-top d-flex justify-content-between align-items-center">
            <Link to="/" className="btn btn-outline-primary btn-sm">Return Home</Link>
            <Link to="/privacy" className="btn btn-link btn-sm text-decoration-none">Read Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
