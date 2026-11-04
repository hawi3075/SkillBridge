import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { skillApi, userApi } from '../../services/api';
import SkillCard from '../../components/cards/SkillCard';
import UserCard from '../../components/cards/UserCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Modal from '../../components/common/Modal';
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
  ChevronUp,
  Play,
  BarChart2,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Video,
  Award
} from 'lucide-react';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredMentors, setFeaturedMentors] = useState([]);
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

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
    <div className="overflow-hidden">
      {/* 1. Hero Section (Updated to match design) */}
      <section className="hero-section position-relative">
        {/* Soft Organic Background Wave Shape */}
        <div className="hero-wave-bg" />
        <svg
          className="position-absolute top-0 end-0 opacity-25 d-none d-lg-block"
          width="600"
          height="600"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ pointerEvents: 'none', zIndex: 0 }}
        >
          <path
            d="M300,50 C450,20 580,150 560,300 C540,450 420,580 270,560 C120,540 20,430 40,280 C60,130 150,80 300,50 Z"
            fill="url(#paint0_linear)"
          />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="1" stopColor="#60A5FA" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>

        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-5 py-2">
            {/* Left Content Column */}
            <div className="col-lg-6">
              {/* Pill Tag */}
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill"
                style={{
                  backgroundColor: '#DBEAFE',
                  color: '#1D4ED8',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em'
                }}
              >
                <span>🚀 Learn • Practice • Grow</span>
              </div>

              {/* Headline with Yellow Brush Underline */}
              <h1
                className="fw-extrabold text-dark mb-3"
                style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em'
                }}
              >
                Bridge Your Skills <br />
                to a{' '}
                <span className="position-relative text-primary d-inline-block">
                  Better Future
                  {/* Yellow/Gold Brush Stroke Underline */}
                  <svg
                    className="position-absolute start-0 w-100"
                    style={{ bottom: '-10px', height: '14px', zIndex: -1 }}
                    viewBox="0 0 250 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 11.5C50 3.5 150 1.5 247 9.5C210 13.5 90 14.5 20 12"
                      stroke="#F59E0B"
                      strokeWidth="5"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                  </svg>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-muted mb-4" style={{ maxWidth: '520px', fontSize: '1.1rem', lineHeight: 1.6 }}>
                SkillBridge connects students with skills, resources, and opportunities to build a successful career through 1-on-1 reciprocal peer learning.
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                <Link
                  to="/register"
                  className="btn btn-primary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 shadow-sm"
                  style={{ fontWeight: 600, fontSize: '0.98rem', backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' }}
                >
                  <span>Get Started</span>
                  <ArrowRight size={17} />
                </Link>

                <button
                  type="button"
                  onClick={() => setShowDemoModal(true)}
                  className="btn btn-light rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 border bg-white shadow-sm hover-lift"
                  style={{ fontWeight: 600, fontSize: '0.98rem', color: '#0F172A' }}
                >
                  <span
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px', backgroundColor: '#EFF6FF', color: '#2563EB' }}
                  >
                    <Play size={13} fill="#2563EB" />
                  </span>
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="d-flex flex-wrap align-items-center gap-4 text-muted small pt-1">
                <span className="d-inline-flex align-items-center gap-1">
                  <CheckCircle2 size={16} color="#10B981" /> 100% Free Peer Exchanges
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <CheckCircle2 size={16} color="#10B981" /> Verified Peer Ratings
                </span>
              </div>
            </div>

            {/* Right Visual Composition with Floating Cards */}
            <div className="col-lg-6">
              <div className="position-relative">
                {/* Organic Backdrop Gradient Blob */}
                <div
                  className="position-absolute"
                  style={{
                    top: '-10%',
                    right: '-10%',
                    width: '120%',
                    height: '120%',
                    background: 'radial-gradient(ellipse at center, rgba(191, 219, 254, 0.45) 0%, rgba(224, 237, 255, 0.2) 70%, transparent 100%)',
                    borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                    zIndex: 0,
                    pointerEvents: 'none'
                  }}
                />

                {/* Main Hero Image */}
                <div
                  className="position-relative overflow-hidden shadow-lg"
                  style={{
                    borderRadius: '28px',
                    border: '5px solid #FFFFFF',
                    zIndex: 1,
                    boxShadow: '0 20px 45px -12px rgba(37, 99, 235, 0.2)'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                    alt="SkillBridge Students collaborating around laptop"
                    className="w-100 d-block"
                    style={{ height: '400px', objectFit: 'cover', objectPosition: 'center 25%' }}
                  />
                  {/* Subtle Vignette Gradient Overlay */}
                  <div
                    className="position-absolute inset-0 w-100 h-100"
                    style={{
                      top: 0,
                      left: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.25) 100%)',
                      pointerEvents: 'none'
                    }}
                  />
                </div>

                {/* Floating Card 1: 10K+ Active Learners (Top Left) */}
                <div
                  className="position-absolute d-flex align-items-center gap-3 bg-white p-2 px-3 rounded-4 shadow-lg border animate-float"
                  style={{
                    top: '20px',
                    left: '-20px',
                    zIndex: 3
                  }}
                >
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px', backgroundColor: '#EFF6FF', color: '#2563EB' }}
                  >
                    <BarChart2 size={22} />
                  </div>
                  <div>
                    <div className="fw-bolder text-dark fs-6 mb-0" style={{ lineHeight: 1.1 }}>10K+</div>
                    <div className="text-muted small" style={{ fontSize: '0.75rem', fontWeight: 500 }}>Active Learners</div>
                  </div>
                </div>

                {/* Floating Card 2: 4.8/5 User Rating (Top Right) */}
                <div
                  className="position-absolute d-flex align-items-center gap-3 bg-white p-2 px-3 rounded-4 shadow-lg border animate-float-delayed"
                  style={{
                    top: '20px',
                    right: '-20px',
                    zIndex: 3
                  }}
                >
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px', backgroundColor: '#FEF3C7', color: '#D97706' }}
                  >
                    <Star size={20} fill="#F59E0B" color="#F59E0B" />
                  </div>
                  <div>
                    <div className="fw-bolder text-dark fs-6 mb-0" style={{ lineHeight: 1.1 }}>4.8/5</div>
                    <div className="text-muted small" style={{ fontSize: '0.75rem', fontWeight: 500 }}>User Rating</div>
                  </div>
                </div>

                {/* Floating Decorative Typography (Bottom Right) */}
                <div
                  className="position-absolute text-white d-none d-sm-block text-end"
                  style={{
                    bottom: '20px',
                    right: '24px',
                    zIndex: 3,
                    textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                    lineHeight: 1.2
                  }}
                >
                  <div className="fs-5 fw-extrabold fst-italic">Learn</div>
                  <div className="fs-5 fw-extrabold fst-italic">Grow</div>
                  <div className="fs-5 fw-extrabold fst-italic" style={{ color: '#FCD34D' }}>Succeed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Docked 4 Feature Cards Ribbon (Directly below Hero) */}
      <section className="position-relative" style={{ zIndex: 4, marginTop: '-36px' }}>
        <div className="container">
          <div className="row g-3">
            {/* Card 1: Expert-Led Courses */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="bg-white p-3 px-4 rounded-4 shadow-sm border d-flex align-items-center gap-3 h-100 hover-lift">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '48px', height: '48px', backgroundColor: '#EFF6FF', color: '#2563EB' }}
                >
                  <BookOpen size={24} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem' }}>Expert-Led Courses</h6>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>Learn from industry experts</p>
                </div>
              </div>
            </div>

            {/* Card 2: Real Opportunities */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="bg-white p-3 px-4 rounded-4 shadow-sm border d-flex align-items-center gap-3 h-100 hover-lift">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '48px', height: '48px', backgroundColor: '#F5F3FF', color: '#7C3AED' }}
                >
                  <Briefcase size={24} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem' }}>Real Opportunities</h6>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>Get connected with jobs</p>
                </div>
              </div>
            </div>

            {/* Card 3: Track Your Progress */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="bg-white p-3 px-4 rounded-4 shadow-sm border d-flex align-items-center gap-3 h-100 hover-lift">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '48px', height: '48px', backgroundColor: '#ECFDF5', color: '#059669' }}
                >
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem' }}>Track Your Progress</h6>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>See your growth journey</p>
                </div>
              </div>
            </div>

            {/* Card 4: Supportive Community */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="bg-white p-3 px-4 rounded-4 shadow-sm border d-flex align-items-center gap-3 h-100 hover-lift">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '48px', height: '48px', backgroundColor: '#EEF2FF', color: '#4F46E5' }}
                >
                  <Users size={24} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem' }}>Supportive Community</h6>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>Learn together, grow together</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works: Simple Steps to Success (Matching bottom of screenshot) */}
      <section className="py-5 position-relative" style={{ backgroundColor: '#F8FAFC' }}>
        {/* Soft Background Wave Transition */}
        <div
          className="position-absolute start-0 w-100"
          style={{
            top: 0,
            height: '60px',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Decorative Watermark Graduation Cap Outline */}
        <div
          className="position-absolute bottom-0 end-0 opacity-10 d-none d-xl-block"
          style={{ transform: 'translate(10%, 10%)', pointerEvents: 'none' }}
        >
          <GraduationCap size={320} color="#2563EB" />
        </div>

        <div className="container py-4 position-relative" style={{ zIndex: 1 }}>
          <div className="text-center mb-5">
            <span className="small fw-semibold text-primary d-block mb-1" style={{ letterSpacing: '0.08em' }}>
              — How It Works —
            </span>
            <h2 className="display-6 fw-extrabold text-dark mb-2">Simple Steps to Success</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '540px', fontSize: '0.98rem' }}>
              Exchange knowledge in three effortless steps. No expensive tuition fees—just real peer learning.
            </p>
          </div>

          <div className="position-relative">
            {/* Playful Handwritten Doodle Annotation on the Left */}
            <div
              className="position-absolute d-none d-lg-block"
              style={{
                top: '-20px',
                left: '20px',
                transform: 'rotate(-8deg)',
                zIndex: 2
              }}
            >
              <span
                className="fw-bold fs-6"
                style={{
                  color: '#1E40AF',
                  fontFamily: "'Plus Jakarta Sans', cursive, sans-serif"
                }}
              >
                Your journey <br /> starts here!
              </span>
              <svg
                width="64"
                height="45"
                viewBox="0 0 64 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="d-block ms-3 mt-1"
              >
                <path
                  d="M10 8 C 25 28, 40 32, 54 22"
                  stroke="#2563EB"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M45 20 L 55 22 L 50 32"
                  stroke="#2563EB"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>

            {/* 3 Step Ribbon / Cards */}
            <div className="steps-ribbon p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '980px' }}>
              <div className="row g-4 text-center">
                {/* Step 1 */}
                <div className="col-md-4 position-relative">
                  <div className="step-num-badge">1</div>
                  <h6 className="fw-bold text-dark mb-2">Create Your Account</h6>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                    List the skills you feel confident teaching and the topics you want to learn next.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="col-md-4 position-relative">
                  <div className="step-num-badge" style={{ backgroundColor: '#4F46E5' }}>2</div>
                  <h6 className="fw-bold text-dark mb-2">Explore Courses</h6>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                    Our smart algorithm surfaces compatible peers offering what you seek and wanting what you offer.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="col-md-4 position-relative">
                  <div className="step-num-badge" style={{ backgroundColor: '#059669' }}>3</div>
                  <h6 className="fw-bold text-dark mb-2">Achieve Your Goals</h6>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                    Send an exchange proposal, chat, book calendar video sessions, and master new skills.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Watch Demo Walkthrough Modal */}
      <Modal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        title="SkillBridge Interactive Demo"
        size="lg"
      >
        <div className="p-2">
          <div className="text-center mb-4">
            <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mb-2">Platform Tour</span>
            <h4 className="fw-extrabold text-dark">See How SkillBridge Works in 60 Seconds</h4>
            <p className="text-muted small mx-auto" style={{ maxWidth: '520px' }}>
              Watch how simple it is to match complementary skills, schedule video tutoring, and build verified credentials.
            </p>
          </div>

          {/* Interactive Feature Steps Preview */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="p-3 bg-light rounded-3 border text-center h-100">
                <div className="mx-auto mb-2 p-2 bg-primary-subtle rounded-circle d-inline-flex text-primary">
                  <Sparkles size={20} />
                </div>
                <h6 className="fw-bold text-dark small mb-1">1. Smart Matching</h6>
                <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>
                  Transparent 20-100% compatibility scores based on skill complementarity.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-light rounded-3 border text-center h-100">
                <div className="mx-auto mb-2 p-2 bg-indigo-subtle rounded-circle d-inline-flex text-indigo" style={{ color: '#4F46E5', backgroundColor: '#EEF2FF' }}>
                  <Video size={20} />
                </div>
                <h6 className="fw-bold text-dark small mb-1">2. Instant Video Calls</h6>
                <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>
                  Calendar scheduling with conflict prevention and Jitsi Meet links.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-light rounded-3 border text-center h-100">
                <div className="mx-auto mb-2 p-2 bg-success-subtle rounded-circle d-inline-flex text-success">
                  <Star size={20} />
                </div>
                <h6 className="fw-bold text-dark small mb-1">3. Verified Reviews</h6>
                <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>
                  Only completed exchanges are eligible for reviews to guarantee trust.
                </p>
              </div>
            </div>
          </div>

          {/* Demo Callout Banner */}
          <div className="p-3 rounded-3 border bg-primary text-white d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <div className="fw-bold small">Ready to experience reciprocal peer learning?</div>
              <div className="text-white-50 small" style={{ fontSize: '0.78rem' }}>Create your free account in under 2 minutes.</div>
            </div>
            <Link
              to="/register"
              onClick={() => setShowDemoModal(false)}
              className="btn btn-sm btn-light fw-bold text-primary rounded-pill px-3"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </Modal>

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
