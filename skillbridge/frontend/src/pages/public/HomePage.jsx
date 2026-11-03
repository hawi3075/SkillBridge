import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { skillApi, userApi } from '../../services/api';
import SkillCard from '../../components/cards/SkillCard';
import UserCard from '../../components/cards/UserCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Users,
  BookOpen,
  Calendar,
  Star,
  Shield,
  HelpCircle,
  MessageCircle,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredMentors, setFeaturedMentors] = useState([]);
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [catsRes, mentorsRes, skillsRes] = await Promise.all([
          skillApi.getCategories(),
          userApi.getUsers({ isMentor: true, limit: 3, sort: 'rating' }),
          skillApi.getSkills({ limit: 6 })
        ]);

        if (catsRes.success) setCategories(catsRes.data || []);
        if (mentorsRes.success) setFeaturedMentors(mentorsRes.data || []);
        if (skillsRes.success) setTrendingSkills((skillsRes.data || []).slice(0, 6));
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const faqs = [
    {
      q: 'How does SkillBridge work?',
      a: 'SkillBridge matches you with peers who want to learn what you know and can teach what you want to learn. For example, if you know React and want to learn UI/UX, we find someone with UI/UX expertise who wants to master React. You schedule sessions and trade knowledge 1-on-1.'
    },
    {
      q: 'Do I have to pay to use SkillBridge?',
      a: 'SkillBridge is built primarily on peer exchange principles—you share your skills in return for learning new ones. There are no mandatory subscription fees for 1-on-1 peer learning exchanges.'
    },
    {
      q: 'What if I am a beginner and don’t have advanced skills to teach yet?',
      a: 'Everyone has valuable skills! It might be native language practice, writing and proofreading, basic web coding, digital marketing, or video editing. You can also offer foundational coaching for beginners in your field.'
    },
    {
      q: 'How are sessions scheduled and hosted?',
      a: 'Once an exchange is agreed upon, either participant can schedule a session directly from their dashboard. SkillBridge automatically provides integrated meeting links (such as Jitsi Meet) and calendar reminders.'
    },
    {
      q: 'How are mentors and peers verified?',
      a: 'Users receive verified reviews and ratings strictly after completed learning exchanges. We also have active platform moderation to ensure a safe, high-quality learning environment.'
    }
  ];

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill border bg-white shadow-sm">
                <span className="badge bg-primary text-white rounded-pill px-2">New</span>
                <span className="small text-muted fw-medium">The #1 Peer Skill Exchange Network</span>
              </div>

              <h1 className="display-4 fw-extrabold mb-3 text-dark" style={{ lineHeight: 1.15 }}>
                Learn Something New. <br />
                <span style={{ color: '#2563EB' }}>Teach What You Know.</span>
              </h1>

              <p className="lead text-muted mb-4" style={{ lineHeight: 1.6, fontSize: '1.15rem' }}>
                SkillBridge connects learners and creators who exchange real-world skills without high tuition fees. Match with complementary peers, schedule sessions, and grow together.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/skills" className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2 px-4 shadow">
                  <span>Explore Skills</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/register" className="btn btn-outline-primary btn-lg px-4">
                  Become a Mentor
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="d-flex flex-wrap align-items-center gap-4 text-muted small pt-2">
                <span className="d-inline-flex align-items-center gap-1">
                  <CheckCircle2 size={16} color="#10B981" /> 100% Free Peer Exchanges
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <CheckCircle2 size={16} color="#10B981" /> Verified Peer Ratings
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <CheckCircle2 size={16} color="#10B981" /> Transparent Compatibility
                </span>
              </div>
            </div>

            {/* Hero Visual Card Composition */}
            <div className="col-lg-6">
              <div className="position-relative">
                {/* Main Card */}
                <div className="sb-card p-4 shadow-lg bg-white position-relative" style={{ zIndex: 2 }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1">
                      Perfect Mutual Match Identified!
                    </span>
                    <span className="match-score-pill match-score-high">
                      <Sparkles size={16} /> 98% Match
                    </span>
                  </div>

                  {/* Matching Simulation */}
                  <div className="row g-3 align-items-center my-2">
                    <div className="col-5 text-center">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                        alt="Alex"
                        className="rounded-circle border mb-2"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                      <div className="fw-bold text-dark small">Alex Morgan</div>
                      <div className="badge bg-primary-subtle text-primary mt-1">Teaches React.js</div>
                    </div>

                    <div className="col-2 text-center">
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          margin: '0 auto',
                          borderRadius: '50%',
                          backgroundColor: '#EEF2FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6366F1'
                        }}
                      >
                        ⚡
                      </div>
                    </div>

                    <div className="col-5 text-center">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                        alt="Elena"
                        className="rounded-circle border mb-2"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                      <div className="fw-bold text-dark small">Elena Rostova</div>
                      <div className="badge bg-indigo-subtle text-indigo mt-1" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                        Teaches Figma UI/UX
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-light rounded-3 mt-3 text-muted small text-center">
                    "Alex learns Figma design systems; Elena masters React component architecture. Both grow faster together!"
                  </div>
                </div>

                {/* Decorative floating stats */}
                <div
                  className="sb-card p-3 shadow position-absolute d-none d-md-flex align-items-center gap-3 bg-white"
                  style={{ bottom: '-25px', left: '-20px', zIndex: 3 }}
                >
                  <div className="p-2 bg-primary-subtle rounded-circle text-primary">
                    <Star size={20} fill="#2563EB" />
                  </div>
                  <div>
                    <div className="fw-bold text-dark">4.9 / 5.0 Average</div>
                    <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Across 2,400+ Sessions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics Counter */}
      <section className="py-4 border-bottom bg-white">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <h3 className="fw-bolder text-primary mb-1">15,000+</h3>
              <div className="text-muted small">Registered Learners & Mentors</div>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bolder text-primary mb-1">120+</h3>
              <div className="text-muted small">Skill Specialties</div>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bolder text-primary mb-1">98.4%</h3>
              <div className="text-muted small">Exchange Match Rate</div>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bolder text-primary mb-1">$0</h3>
              <div className="text-muted small">Average Cost per Session</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works (3 Simple Steps) */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">Simple & Intuitive</span>
            <h2 className="fw-extrabold text-dark">How SkillBridge Works</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '540px' }}>
              Exchange knowledge in three effortless steps. No complicated coins or paywalls—just real peer learning.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="sb-card p-4 text-center h-100">
                <div
                  className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '64px', height: '64px', backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '1.25rem', fontWeight: 700 }}
                >
                  1
                </div>
                <h5 className="fw-bold mb-2">Create Your Profile</h5>
                <p className="text-muted small" style={{ lineHeight: 1.6 }}>
                  List the skills you feel confident teaching and the topics you want to learn next. Set your availability and experience level.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="sb-card p-4 text-center h-100">
                <div
                  className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '64px', height: '64px', backgroundColor: '#EEF2FF', color: '#6366F1', fontSize: '1.25rem', fontWeight: 700 }}
                >
                  2
                </div>
                <h5 className="fw-bold mb-2">Smart Compatibility Matching</h5>
                <p className="text-muted small" style={{ lineHeight: 1.6 }}>
                  Our algorithm instantly surfaces compatible peers who want your knowledge and offer what you seek, with transparent scores.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="sb-card p-4 text-center h-100">
                <div
                  className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '64px', height: '64px', backgroundColor: '#ECFDF5', color: '#10B981', fontSize: '1.25rem', fontWeight: 700 }}
                >
                  3
                </div>
                <h5 className="fw-bold mb-2">Connect, Schedule & Learn</h5>
                <p className="text-muted small" style={{ lineHeight: 1.6 }}>
                  Send an exchange proposal, chat in real-time, book calendar sessions with automated video rooms, and leave verified reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Popular Skill Categories */}
      <section className="py-5" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container py-4">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
            <div>
              <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">Browse Catalog</span>
              <h2 className="fw-extrabold text-dark mb-0">Popular Skill Categories</h2>
            </div>
            <Link to="/skills" className="btn btn-outline-primary d-inline-flex align-items-center gap-1">
              <span>View All Categories</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="row g-3">
            {categories.slice(0, 8).map((cat) => (
              <div key={cat.id} className="col-6 col-md-4 col-lg-3">
                <Link
                  to={`/skills?category=${cat.id}`}
                  className="sb-card sb-card-hover p-3 d-flex align-items-center gap-3 text-decoration-none h-100"
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563EB'
                    }}
                  >
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">{cat.name}</h6>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      {cat.skills?.length || 3} skills
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Mentors */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
            <div>
              <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">Expert Peers</span>
              <h2 className="fw-extrabold text-dark mb-0">Featured Mentors</h2>
            </div>
            <Link to="/mentors" className="btn btn-outline-primary d-inline-flex align-items-center gap-1">
              <span>Find More Mentors</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={3} type="card" />
          ) : (
            <div className="row g-4">
              {featuredMentors.map((m) => (
                <div key={m.id} className="col-md-6 col-lg-4">
                  <UserCard user={m} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Trending Skills */}
      <section className="py-5" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container py-4">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
            <div>
              <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">High Demand</span>
              <h2 className="fw-extrabold text-dark mb-0">Trending Skills for Exchange</h2>
            </div>
            <Link to="/skills" className="btn btn-outline-primary d-inline-flex align-items-center gap-1">
              <span>Explore All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={3} type="card" />
          ) : (
            <div className="row g-4">
              {trendingSkills.map((sk) => (
                <div key={sk.id} className="col-md-6 col-lg-4">
                  <SkillCard skill={sk} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. Community Testimonials */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">Community Stories</span>
            <h2 className="fw-extrabold text-dark">Loved by Learners & Mentors</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="sb-card p-4 h-100 d-flex flex-column">
                <div className="d-flex align-items-center gap-2 mb-3 text-warning">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" />)}
                </div>
                <p className="text-muted small flex-grow-1" style={{ lineHeight: 1.6 }}>
                  "I was struggling to understand Figma auto-layouts until I matched with Elena. In exchange, I helped her understand React state and component architecture. It's the most productive way to learn!"
                </p>
                <div className="d-flex align-items-center gap-3 pt-3 border-top">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="Alex"
                    className="rounded-circle"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  />
                  <div>
                    <div className="fw-bold small text-dark">Alex Morgan</div>
                    <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Staff Frontend Engineer</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="sb-card p-4 h-100 d-flex flex-column">
                <div className="d-flex align-items-center gap-2 mb-3 text-warning">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" />)}
                </div>
                <p className="text-muted small flex-grow-1" style={{ lineHeight: 1.6 }}>
                  "As a native Spanish speaker, teaching conversational Spanish to Marcus in return for Python data analytics helped me automate my agency's keyword ranking reports in less than three weeks."
                </p>
                <div className="d-flex align-items-center gap-3 pt-3 border-top">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                    alt="Sofia"
                    className="rounded-circle"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  />
                  <div>
                    <div className="fw-bold small text-dark">Sofia Mendez</div>
                    <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Head of Growth</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="sb-card p-4 h-100 d-flex flex-column">
                <div className="d-flex align-items-center gap-2 mb-3 text-warning">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" />)}
                </div>
                <p className="text-muted small flex-grow-1" style={{ lineHeight: 1.6 }}>
                  "The matching algorithm is brilliantly accurate. It showed me a 96% match with Kenji in Tokyo. I learned Japanese conversational etiquette while helping him build Express microservices."
                </p>
                <div className="d-flex align-items-center gap-3 pt-3 border-top">
                  <img
                    src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80"
                    alt="Liam"
                    className="rounded-circle"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  />
                  <div>
                    <div className="fw-bold small text-dark">Liam O'Connor</div>
                    <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Backend Engineer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="py-5" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">Got Questions?</span>
            <h2 className="fw-extrabold text-dark">Frequently Asked Questions</h2>
          </div>

          <div className="mx-auto" style={{ maxWidth: '720px' }}>
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="sb-card mb-3 overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-100 p-3 px-4 d-flex justify-content-between align-items-center text-start border-0 bg-white"
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="fw-bold text-dark">{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} className="text-muted" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-1 text-muted small bg-white" style={{ lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Final Call to Action */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #6366F1 100%)' }}>
        <div className="container py-4 text-center text-white">
          <h2 className="display-6 fw-extrabold mb-3 text-white">
            Ready to Accelerate Your Learning Journey?
          </h2>
          <p className="lead mx-auto mb-4 text-white-50" style={{ maxWidth: '580px', fontSize: '1.1rem' }}>
            Join thousands of professionals, developers, designers, and students trading knowledge on SkillBridge today.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register" className="btn btn-light btn-lg px-4 text-primary fw-bold shadow">
              Create Free Account
            </Link>
            <Link to="/how-it-works" className="btn btn-outline-light btn-lg px-4">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
