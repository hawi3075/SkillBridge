import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ContactUsPage = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    category: 'General Support',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      showToast('Thank you! Your message has been sent to our support team.', 'success');
      setFormData({ fullName: '', email: '', category: 'General Support', subject: '', message: '' });
    }, 600);
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">Get In Touch</span>
          <h1 className="fw-extrabold text-dark mb-2">We’d Love to Hear From You</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Have a question about peer exchange, feedback on features, or need assistance? Our support team is here to assist.
          </p>
        </div>

        <div className="row g-5">
          {/* Contact Details */}
          <div className="col-lg-5">
            <div className="sb-card p-4 p-md-5 bg-white h-100">
              <h4 className="fw-bold text-dark mb-4">Contact Information</h4>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="p-3 bg-primary-subtle text-primary rounded-3">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="fw-bold text-dark small">Email Support</div>
                  <div className="text-muted small">support@skillbridge.io</div>
                  <div className="text-muted small">help@skillbridge.io</div>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="p-3 bg-primary-subtle text-primary rounded-3">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <div className="fw-bold text-dark small">Community Forum</div>
                  <div className="text-muted small">Join live discussions on our community Discord and Slack.</div>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="p-3 bg-primary-subtle text-primary rounded-3">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="fw-bold text-dark small">Headquarters</div>
                  <div className="text-muted small">SkillBridge Platform Inc.</div>
                  <div className="text-muted small">548 Market St, San Francisco, CA</div>
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 mt-auto">
                <span className="small text-muted">
                  ⏱️ <strong>Typical Response Time:</strong> Within 24 hours during business days.
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="col-lg-7">
            <div className="sb-card p-4 p-md-5 bg-white">
              <h4 className="fw-bold text-dark mb-4">Send Us a Message</h4>

              {submitted ? (
                <div className="text-center py-5">
                  <div className="p-3 bg-success-subtle text-success rounded-circle d-inline-flex mb-3">
                    <CheckCircle2 size={40} />
                  </div>
                  <h5 className="fw-bold text-dark">Message Delivered!</h5>
                  <p className="text-muted small mx-auto" style={{ maxWidth: '400px' }}>
                    Thank you for reaching out. One of our support coordinators will get back to you shortly.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-outline-primary btn-sm">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-dark">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="John Doe"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-dark">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="john@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-dark">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="General Support">General Support</option>
                        <option value="Account & Auth">Account & Auth</option>
                        <option value="Exchange Issue">Exchange Issue</option>
                        <option value="Feature Suggestion">Feature Suggestion</option>
                        <option value="Partnership">Partnership</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-dark">Subject</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Brief summary"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-dark">Your Message</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Please explain your question or feedback in detail..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary d-inline-flex align-items-center gap-2 px-4"
                    disabled={submitting}
                  >
                    <Send size={16} />
                    <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
