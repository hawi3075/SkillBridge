import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userApi, skillApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  User,
  BookOpen,
  Plus,
  Trash2,
  Camera,
  Save,
  Check,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('PERSONAL');
  const [categories, setCategories] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    bio: '',
    location: '',
    education: '',
    occupation: '',
    experienceLevel: 'INTERMEDIATE',
    languages: 'English',
    availability: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    twitterUrl: '',
    isMentor: false,
    mentorBio: ''
  });

  // Manage Skills state
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [wantedSkills, setWantedSkills] = useState([]);

  // New Offered Skill inputs
  const [newOfferedSkillId, setNewOfferedSkillId] = useState('');
  const [newOfferedProficiency, setNewOfferedProficiency] = useState('INTERMEDIATE');
  const [newOfferedYears, setNewOfferedYears] = useState('2');
  const [newOfferedDesc, setNewOfferedDesc] = useState('');

  // New Wanted Skill inputs
  const [newWantedSkillId, setNewWantedSkillId] = useState('');
  const [newWantedPriority, setNewWantedPriority] = useState('HIGH');
  const [newWantedGoals, setNewWantedGoals] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.profile?.fullName || '',
        bio: user.profile?.bio || '',
        location: user.profile?.location || '',
        education: user.profile?.education || '',
        occupation: user.profile?.occupation || '',
        experienceLevel: user.profile?.experienceLevel || 'INTERMEDIATE',
        languages: user.profile?.languages || 'English',
        availability: user.profile?.availability || '',
        githubUrl: user.profile?.githubUrl || '',
        linkedinUrl: user.profile?.linkedinUrl || '',
        portfolioUrl: user.profile?.portfolioUrl || '',
        twitterUrl: user.profile?.twitterUrl || '',
        isMentor: user.profile?.isMentor || user.role === 'MENTOR',
        mentorBio: user.profile?.mentorBio || ''
      });
      setOfferedSkills(user.offeredSkills || []);
      setWantedSkills(user.wantedSkills || []);
    }

    const loadSkillsAndCategories = async () => {
      try {
        const [catRes, skillsRes, mySkillsRes] = await Promise.all([
          skillApi.getCategories(),
          skillApi.getSkills(),
          skillApi.getMySkills()
        ]);
        if (catRes.success) setCategories(catRes.data || []);
        if (skillsRes.success) {
          setAvailableSkills(skillsRes.data || []);
          if (skillsRes.data?.length > 0) {
            setNewOfferedSkillId(skillsRes.data[0].id);
            setNewWantedSkillId(skillsRes.data[0].id);
          }
        }
        if (mySkillsRes.success && mySkillsRes.data) {
          setOfferedSkills(mySkillsRes.data.offered || []);
          setWantedSkills(mySkillsRes.data.wanted || []);
        }
      } catch (err) {
        console.error('Failed to load skill catalog:', err);
      }
    };

    loadSkillsAndCategories();
  }, [user]);

  // Profile strength calculation
  const calculateStrength = () => {
    let score = 0;
    if (profileForm.fullName) score += 15;
    if (profileForm.bio) score += 20;
    if (profileForm.occupation) score += 15;
    if (profileForm.location) score += 10;
    if (offeredSkills.length > 0) score += 15;
    if (wantedSkills.length > 0) score += 15;
    if (profileForm.githubUrl || profileForm.linkedinUrl || profileForm.portfolioUrl) score += 10;
    return Math.min(score, 100);
  };

  const profileStrength = calculateStrength();

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await userApi.updateProfile(profileForm);
      if (res.success) {
        updateUser({ profile: res.data });
        showToast('Profile information successfully saved!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUploadingAvatar(true);
      const res = await userApi.uploadAvatar(formData);
      if (res.success) {
        updateUser({ profile: { ...user.profile, avatarUrl: res.data.avatarUrl } });
        showToast('Profile photo updated!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload photo', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Add Offered Skill
  const handleAddOfferedSkill = async (e) => {
    e.preventDefault();
    if (!newOfferedSkillId) return;

    try {
      const res = await skillApi.addOfferedSkill({
        skillId: newOfferedSkillId,
        proficiencyLevel: newOfferedProficiency,
        yearsOfExperience: parseInt(newOfferedYears, 10) || 1,
        description: newOfferedDesc
      });

      if (res.success) {
        showToast('Skill added to your teaching profile!', 'success');
        const updated = await skillApi.getMySkills();
        if (updated.success) setOfferedSkills(updated.data.offered || []);
        setNewOfferedDesc('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to add skill', 'error');
    }
  };

  const handleRemoveOfferedSkill = async (skillId) => {
    try {
      await skillApi.removeOfferedSkill(skillId);
      setOfferedSkills(prev => prev.filter(s => s.skillId !== skillId));
      showToast('Skill removed from teaching profile', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to remove skill', 'error');
    }
  };

  // Add Wanted Skill
  const handleAddWantedSkill = async (e) => {
    e.preventDefault();
    if (!newWantedSkillId) return;

    try {
      const res = await skillApi.addWantedSkill({
        skillId: newWantedSkillId,
        priority: newWantedPriority,
        goals: newWantedGoals
      });

      if (res.success) {
        showToast('Skill added to your learning wishlist!', 'success');
        const updated = await skillApi.getMySkills();
        if (updated.success) setWantedSkills(updated.data.wanted || []);
        setNewWantedGoals('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to add learning goal', 'error');
    }
  };

  const handleRemoveWantedSkill = async (skillId) => {
    try {
      await skillApi.removeWantedSkill(skillId);
      setWantedSkills(prev => prev.filter(s => s.skillId !== skillId));
      showToast('Skill removed from wishlist', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to remove skill', 'error');
    }
  };

  return (
    <div className="py-2">
      {/* 1. Header Profile Banner Card */}
      <div className="admin-card mb-4 overflow-hidden">
        <div className="profile-cover-banner p-3 d-flex justify-content-end align-items-start">
          <Link
            to={`/users/${user?.id}`}
            className="btn btn-sm btn-light bg-white bg-opacity-90 backdrop-blur rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 shadow-sm fw-semibold"
            style={{ fontSize: '0.78rem' }}
          >
            <Eye size={14} />
            <span>View Public Profile</span>
            <ExternalLink size={12} className="text-muted" />
          </Link>
        </div>

        <div className="px-4 pb-4">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3">
            <div className="d-flex align-items-end gap-3">
              {/* Avatar with Camera Button */}
              <div className="profile-avatar-wrapper">
                <img
                  src={user?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                  alt={profileForm.fullName || user?.username}
                  className="rounded-circle w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
                <label className="profile-avatar-btn" title="Change profile photo">
                  <Camera size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="d-none"
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>

              <div>
                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <h4 className="fw-extrabold text-dark mb-0">
                    {profileForm.fullName || user?.username}
                  </h4>
                  {profileForm.isMentor && (
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                      <CheckCircle2 size={12} className="me-1 d-inline" /> Verified Mentor
                    </span>
                  )}
                  {user?.role === 'ADMIN' && (
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                      Administrator
                    </span>
                  )}
                </div>

                <div className="text-muted small d-flex flex-wrap align-items-center gap-3">
                  <span>@{user?.username}</span>
                  {profileForm.occupation && (
                    <>
                      <span>•</span>
                      <span className="text-dark fw-medium">{profileForm.occupation}</span>
                    </>
                  )}
                  {profileForm.location && (
                    <>
                      <span>•</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <MapPin size={13} /> {profileForm.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Strength Meter */}
            <div className="p-3 bg-light rounded-3 border" style={{ minWidth: '220px' }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                  PROFILE STRENGTH
                </span>
                <span className="fw-extrabold text-primary" style={{ fontSize: '0.8rem' }}>
                  {profileStrength}%
                </span>
              </div>
              <div className="progress" style={{ height: '6px', borderRadius: '9999px', backgroundColor: '#E2E8F0' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${profileStrength}%`, borderRadius: '9999px' }}
                ></div>
              </div>
              <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                {profileStrength === 100
                  ? 'All core details completed! 🎉'
                  : 'Add skills & links to reach 100%'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Modern Segmented Tab Bar */}
      <div className="admin-card p-1.5 mb-4 d-inline-flex flex-wrap gap-1 bg-white border">
        <button
          className={`profile-tab-pill ${activeTab === 'PERSONAL' ? 'active' : ''}`}
          onClick={() => setActiveTab('PERSONAL')}
        >
          <User size={15} />
          <span>Personal Info</span>
        </button>

        <button
          className={`profile-tab-pill ${activeTab === 'TEACHING' ? 'active' : ''}`}
          onClick={() => setActiveTab('TEACHING')}
        >
          <GraduationCap size={15} />
          <span>Skills to Teach</span>
          <span className="badge rounded-pill bg-light text-dark border px-2" style={{ fontSize: '0.7rem' }}>
            {offeredSkills.length}
          </span>
        </button>

        <button
          className={`profile-tab-pill ${activeTab === 'LEARNING' ? 'active' : ''}`}
          onClick={() => setActiveTab('LEARNING')}
        >
          <Sparkles size={15} />
          <span>Learning Wishlist</span>
          <span className="badge rounded-pill bg-light text-dark border px-2" style={{ fontSize: '0.7rem' }}>
            {wantedSkills.length}
          </span>
        </button>

        <button
          className={`profile-tab-pill ${activeTab === 'SOCIALS' ? 'active' : ''}`}
          onClick={() => setActiveTab('SOCIALS')}
        >
          <Globe size={15} />
          <span>Social & Links</span>
        </button>

        <button
          className={`profile-tab-pill ${activeTab === 'MENTORSHIP' ? 'active' : ''}`}
          onClick={() => setActiveTab('MENTORSHIP')}
        >
          <Award size={15} />
          <span>Mentorship & Schedule</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: Personal Info */}
      {activeTab === 'PERSONAL' && (
        <div className="admin-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <div>
              <h5 className="fw-bold text-dark mb-0">Personal Details</h5>
              <span className="text-muted small">Update your public identity and professional summary</span>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-dark">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <User size={15} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    required
                    placeholder="e.g. Elena Rostova"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-dark">Username</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">@</span>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={user?.username || ''}
                    disabled
                  />
                </div>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>Usernames are unique across SkillBridge</span>
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small fw-semibold text-dark mb-0">Bio / About Me</label>
                <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                  {profileForm.bio.length} characters
                </span>
              </div>
              <textarea
                className="form-control"
                rows="3"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Describe your background, what topics excite you, and what kind of learners you love collaborating with..."
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-dark">Headline / Occupation</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <Briefcase size={15} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.occupation}
                    onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                    placeholder="e.g. Product Designer & React Developer"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-dark">Location</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <MapPin size={15} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    placeholder="e.g. Berlin, Germany (or Remote)"
                  />
                </div>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-dark">Education / Credentials</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <GraduationCap size={15} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.education}
                    onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                    placeholder="e.g. B.Sc. Computer Science"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold text-dark">Spoken Languages</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <Globe size={15} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.languages}
                    onChange={(e) => setProfileForm({ ...profileForm, languages: e.target.value })}
                    placeholder="e.g. English, German"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold text-dark">General Experience</label>
                <select
                  className="form-select"
                  value={profileForm.experienceLevel}
                  onChange={(e) => setProfileForm({ ...profileForm, experienceLevel: e.target.value })}
                >
                  <option value="BEGINNER">Beginner (1-2 yrs)</option>
                  <option value="INTERMEDIATE">Intermediate (2-4 yrs)</option>
                  <option value="ADVANCED">Advanced (5-8 yrs)</option>
                  <option value="EXPERT">Expert (8+ yrs)</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="btn btn-primary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 shadow-sm fw-semibold"
              >
                <Save size={16} />
                <span>{savingProfile ? 'Saving...' : 'Save Personal Details'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Skills You Can Teach */}
      {activeTab === 'TEACHING' && (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="admin-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                  <h5 className="fw-bold text-dark mb-0">Skills You Can Teach</h5>
                  <span className="text-muted small">Fellow learners will discover you based on these skills</span>
                </div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1">
                  {offeredSkills.length} Listed
                </span>
              </div>

              {offeredSkills.length === 0 ? (
                <div className="text-center py-5 border rounded-3 border-dashed bg-light">
                  <BookOpen size={32} className="text-muted mb-2" />
                  <h6 className="fw-bold text-dark mb-1">No teaching skills added yet</h6>
                  <p className="text-muted small mb-0" style={{ maxWidth: '320px', margin: '0 auto' }}>
                    Select a skill from the catalog on the right to start offering 1-on-1 reciprocal exchanges.
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2.5">
                  {offeredSkills.map((os) => (
                    <div key={os.id || os.skillId} className="profile-skill-card d-flex justify-content-between align-items-center">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="fw-bold text-dark">{os.skill?.name || 'Skill'}</span>
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle" style={{ fontSize: '0.68rem' }}>
                            {os.proficiencyLevel}
                          </span>
                          <span className="badge bg-light text-muted border" style={{ fontSize: '0.68rem' }}>
                            {os.yearsOfExperience} yr{os.yearsOfExperience === 1 ? '' : 's'} exp
                          </span>
                        </div>
                        {os.description && (
                          <div className="text-secondary small" style={{ fontSize: '0.78rem' }}>
                            "{os.description}"
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemoveOfferedSkill(os.skillId)}
                        className="btn btn-sm btn-outline-danger border-0 p-1.5 rounded-circle"
                        title="Remove skill"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="admin-card p-4">
              <h5 className="fw-bold text-dark mb-1">Add a Teaching Skill</h5>
              <span className="text-muted small d-block mb-3">
                Share what you have mastered with community peers.
              </span>

              <form onSubmit={handleAddOfferedSkill}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">Select Skill</label>
                  <select
                    className="form-select shadow-sm"
                    value={newOfferedSkillId}
                    onChange={(e) => setNewOfferedSkillId(e.target.value)}
                    required
                  >
                    {availableSkills.map((sk) => (
                      <option key={sk.id} value={sk.id}>
                        {sk.name} ({sk.category?.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-dark">Proficiency</label>
                    <select
                      className="form-select shadow-sm"
                      value={newOfferedProficiency}
                      onChange={(e) => setNewOfferedProficiency(e.target.value)}
                    >
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>

                  <div className="col-6">
                    <label className="form-label small fw-semibold text-dark">Years of Exp</label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      className="form-control shadow-sm"
                      value={newOfferedYears}
                      onChange={(e) => setNewOfferedYears(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-dark">What You Can Help Teach</label>
                  <textarea
                    className="form-control shadow-sm"
                    rows="2"
                    placeholder="e.g. Code reviews, state management, building full-stack SPAs..."
                    value={newOfferedDesc}
                    onChange={(e) => setNewOfferedDesc(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill py-2 d-inline-flex align-items-center justify-content-center gap-1.5 shadow-sm fw-semibold"
                >
                  <Plus size={16} />
                  <span>Add to Teaching Profile</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Skills You Want to Learn */}
      {activeTab === 'LEARNING' && (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="admin-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                  <h5 className="fw-bold text-dark mb-0">Learning Wishlist</h5>
                  <span className="text-muted small">Our algorithm pairs you with mentors matching these goals</span>
                </div>
                <span className="badge bg-indigo-subtle text-indigo border rounded-pill px-2.5 py-1" style={{ color: '#4F46E5', backgroundColor: '#EEF2FF' }}>
                  {wantedSkills.length} Goals
                </span>
              </div>

              {wantedSkills.length === 0 ? (
                <div className="text-center py-5 border rounded-3 border-dashed bg-light">
                  <Sparkles size={32} className="text-muted mb-2" />
                  <h6 className="fw-bold text-dark mb-1">Your wishlist is empty</h6>
                  <p className="text-muted small mb-0" style={{ maxWidth: '320px', margin: '0 auto' }}>
                    Add skills you want to learn so SkillBridge can calculate high-compatibility matches for you.
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2.5">
                  {wantedSkills.map((ws) => (
                    <div key={ws.id || ws.skillId} className="profile-skill-card d-flex justify-content-between align-items-center">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="fw-bold text-dark">{ws.skill?.name || 'Skill'}</span>
                          <span
                            className="badge rounded-pill"
                            style={{
                              backgroundColor: ws.priority === 'HIGH' ? '#FEE2E2' : '#EFF6FF',
                              color: ws.priority === 'HIGH' ? '#B91C1C' : '#1D4ED8',
                              fontSize: '0.68rem'
                            }}
                          >
                            {ws.priority} Priority
                          </span>
                        </div>
                        {ws.goals && (
                          <div className="text-secondary small" style={{ fontSize: '0.78rem' }}>
                            Goal: "{ws.goals}"
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemoveWantedSkill(ws.skillId)}
                        className="btn btn-sm btn-outline-danger border-0 p-1.5 rounded-circle"
                        title="Remove goal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="admin-card p-4">
              <h5 className="fw-bold text-dark mb-1">Add a Learning Goal</h5>
              <span className="text-muted small d-block mb-3">
                Tell the community what you want to study next.
              </span>

              <form onSubmit={handleAddWantedSkill}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">Select Skill to Learn</label>
                  <select
                    className="form-select shadow-sm"
                    value={newWantedSkillId}
                    onChange={(e) => setNewWantedSkillId(e.target.value)}
                    required
                  >
                    {availableSkills.map((sk) => (
                      <option key={sk.id} value={sk.id}>
                        {sk.name} ({sk.category?.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">Learning Priority</label>
                  <select
                    className="form-select shadow-sm"
                    value={newWantedPriority}
                    onChange={(e) => setNewWantedPriority(e.target.value)}
                  >
                    <option value="HIGH">High Priority (Active project need)</option>
                    <option value="MEDIUM">Medium Priority (Expanding toolbox)</option>
                    <option value="LOW">Casual Exploration (Curiosity)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-dark">Learning Objective / Target</label>
                  <textarea
                    className="form-control shadow-sm"
                    rows="2"
                    placeholder="e.g. Want to build a production SaaS backend with Prisma and Docker..."
                    value={newWantedGoals}
                    onChange={(e) => setNewWantedGoals(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-outline-primary w-100 rounded-pill py-2 d-inline-flex align-items-center justify-content-center gap-1.5 shadow-sm fw-semibold"
                >
                  <Plus size={16} />
                  <span>Add to Learning Wishlist</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Socials & External Links */}
      {activeTab === 'SOCIALS' && (
        <div className="admin-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <div>
              <h5 className="fw-bold text-dark mb-0">Portfolios & Social Media</h5>
              <span className="text-muted small">Showcase your repositories, designs, and professional profiles</span>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-dark">GitHub Profile</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <Github size={16} />
                  </span>
                  <input
                    type="url"
                    className="form-control"
                    value={profileForm.githubUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-dark">LinkedIn Profile</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <Linkedin size={16} color="#0A66C2" />
                  </span>
                  <input
                    type="url"
                    className="form-control"
                    value={profileForm.linkedinUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-dark">Portfolio / Personal Website</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <Globe size={16} color="#10B981" />
                  </span>
                  <input
                    type="url"
                    className="form-control"
                    value={profileForm.portfolioUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, portfolioUrl: e.target.value })}
                    placeholder="https://yourportfolio.dev"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-dark">Twitter / X Handle or URL</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <Twitter size={16} color="#1DA1F2" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.twitterUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, twitterUrl: e.target.value })}
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="btn btn-primary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 shadow-sm fw-semibold"
              >
                <Save size={16} />
                <span>{savingProfile ? 'Saving...' : 'Save Social Links'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: Mentorship Status & Availability Schedule */}
      {activeTab === 'MENTORSHIP' && (
        <div className="admin-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <div>
              <h5 className="fw-bold text-dark mb-0">Mentorship Status & Availability</h5>
              <span className="text-muted small">Configure mentor visibility and session scheduling windows</span>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            {/* Mentor Mode Toggle Card */}
            <div className="p-4 rounded-3 border mb-4" style={{ backgroundColor: '#F8FAFC' }}>
              <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Award size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">Offer Dedicated Peer Mentorship</h6>
                    <span className="text-muted small">List yourself in the public "Find Mentors" directory</span>
                  </div>
                </div>

                <div className="form-check form-switch fs-5 mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="mentorSwitch"
                    checked={profileForm.isMentor}
                    onChange={(e) => setProfileForm({ ...profileForm, isMentor: e.target.checked })}
                  />
                </div>
              </div>

              {profileForm.isMentor && (
                <div className="mt-3 pt-3 border-top">
                  <label className="form-label small fw-semibold text-dark">Mentor Bio & Tutoring Philosophy</label>
                  <textarea
                    className="form-control mb-2"
                    rows="3"
                    value={profileForm.mentorBio}
                    onChange={(e) => setProfileForm({ ...profileForm, mentorBio: e.target.value })}
                    placeholder="Describe your teaching approach, background mentoring others, and what learners can expect during sessions..."
                  />
                  <div className="text-muted small" style={{ fontSize: '0.74rem' }}>
                    This bio is highlighted on your mentor card in the public directory.
                  </div>
                </div>
              )}
            </div>

            {/* Availability Window */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-dark">Availability Window for Exchanges</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <Clock size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.availability}
                  onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                  placeholder="e.g. Weekdays 6:00 PM – 9:00 PM (EST), Saturdays 10:00 AM – 2:00 PM"
                />
              </div>
              <span className="text-muted" style={{ fontSize: '0.74rem' }}>
                Helps exchange partners propose calendar times that match your schedule.
              </span>
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="btn btn-primary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 shadow-sm fw-semibold"
              >
                <Save size={16} />
                <span>{savingProfile ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
