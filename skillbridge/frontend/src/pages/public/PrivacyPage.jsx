import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPage = () => {
  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="sb-card p-4 p-md-5 bg-white">
          <h1 className="fw-extrabold text-dark mb-2">Privacy Policy</h1>
          <div className="text-muted small mb-4">Last Updated: November 2026</div>

          <div className="text-muted small" style={{ lineHeight: 1.8 }}>
            <h5 className="fw-bold text-dark mt-4">1. Information We Collect</h5>
            <p>
              When registering for SkillBridge, we collect basic account credentials including your full name, username, email address, and encrypted password. You may also voluntarily provide profile details such as your biography, location, spoken languages, social links, and offered/wanted skills.
            </p>

            <h5 className="fw-bold text-dark mt-4">2. How We Use Your Information</h5>
            <p>
              Your profile information and skills inventory are used strictly to calculate transparent peer compatibility matches, facilitate exchange requests, send session notifications, and enable real-time messaging with your agreed learning partners.
            </p>

            <h5 className="fw-bold text-dark mt-4">3. Data Security & Storage</h5>
            <p>
              We implement industry-standard cryptographic practices. Passwords are never stored in plain text and are hashed using secure algorithms. JWT tokens are verified on every protected request. We never sell your personal information or contact details to third-party advertisers.
            </p>

            <h5 className="fw-bold text-dark mt-4">4. Cookies and Session Storage</h5>
            <p>
              SkillBridge uses browser local storage and authentication session tokens solely to keep you logged in and preserve your active session preferences across browser tabs.
            </p>

            <h5 className="fw-bold text-dark mt-4">5. Account Deletion Rights</h5>
            <p>
              You have the right to request deletion of your account and personal profile data at any time directly through your dashboard settings or by contacting our team at privacy@skillbridge.io.
            </p>
          </div>

          <div className="mt-5 pt-3 border-top d-flex justify-content-between align-items-center">
            <Link to="/" className="btn btn-outline-primary btn-sm">Return Home</Link>
            <Link to="/terms" className="btn btn-link btn-sm text-decoration-none">Read Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
