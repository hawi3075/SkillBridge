import React, { useState, useEffect } from 'react';
import { userApi, skillApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, BookOpen, Plus, Trash2, Camera, Save, Check } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

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

  // New Offered Skill modal/inputs
  const [newOfferedSkillId, setNewOfferedSkillId] = useState('');
  const [newOfferedProficiency, setNewOfferedProficiency] = useState('INTERMEDIATE');
  const [newOfferedYears, setNewOfferedYears] = useState('2');
  const [newOfferedDesc, setNewOfferedDesc] = useState('');

  // New Wanted Skill inputs
  const [newWantedSkillId, setNewWantedSkillId] = useState('');
  const [newWantedPriority, setNewWantedPriority] = useState('HIGH');
  const [newWantedGoals, setNewWantedGoals] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);

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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await userApi.updateProfile(profileForm);
      if (res.success) {
        updateUser({ profile: res.data });
        showToast('Profile updated successfully!', 'success');
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
      const res = await userApi.uploadAvatar(formData);
      if (res.success) {
        updateUser({ profile: { avatarUrl: res.data.avatarUrl } });
        showToast('Profile picture uploaded successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload avatar', 'error');
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
        yearsOfExperience: parseInt(newOfferedYears),
        description: newOfferedDesc
      });

      if (res.success) {
        showToast('Skill added to teaching profile!', 'success');
        // Refresh my skills
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
      showToast('Offered skill removed', 'info');
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
        showToast('Skill added to learning wishlist!', 'success');
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
      showToast('Wanted skill removed', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to remove skill', 'error');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Profile & Skill Inventory</h4>
          <span className="text-muted small">
            Keep your bio and skills updated to receive optimal matching recommendations.
          </span>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Personal Profile Form */}
        <div className="col-lg-7">
          <div className="sb-card p-4 bg-white mb-4">
            <h5 className="fw-bold text-dark mb-4 border-bottom pb-2">Personal Information</h5>

            {/* Avatar Upload */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <img
                src={user?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                alt="Avatar"
                className="rounded-circle border"
                style={{ width: '64px', height: '64px', objectFit: 'cover' }}
              />
              <div>
                <label className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 cursor-pointer">
                  <Camera size={14} />
                  <span>Change Photo</span>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="d-none" />
                </label>
                <div className="text-muted small mt-1" style={{ fontSize: '0.72rem' }}>
                  PNG, JPG or WebP up to 5MB
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user?.username || ''}
                    disabled
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Bio / Professional Summary</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Share a short summary of your background, learning interests, and experience..."
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">Occupation / Role</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.occupation}
                    onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    placeholder="e.g. Austin, TX, USA"
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">Spoken Languages</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.languages}
                    onChange={(e) => setProfileForm({ ...profileForm, languages: e.target.value })}
                    placeholder="e.g. English, Spanish, French"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">General Experience Level</label>
                  <select
                    className="form-select"
                    value={profileForm.experienceLevel}
                    onChange={(e) => setProfileForm({ ...profileForm, experienceLevel: e.target.value })}
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-dark">Availability Window</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.availability}
                  onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                  placeholder="e.g. Weekdays 6 PM - 9 PM, Weekends 10 AM - 2 PM (CST)"
                />
              </div>

              {/* Mentor Offering Mode */}
              <div className="p-3 bg-light rounded-3 border mb-4">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="mentorSwitch"
                    checked={profileForm.isMentor}
                    onChange={(e) => setProfileForm({ ...profileForm, isMentor: e.target.checked })}
                  />
                  <label className="form-check-label fw-bold text-dark small" htmlFor="mentorSwitch">
                    Enable Mentor Status (Offer Dedicated Mentorship)
                  </label>
                </div>
                <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
                  Enabling mentor status lists your profile in the "Find Mentors" directory and unlocks the Mentor Portal.
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary d-inline-flex align-items-center gap-2"
                disabled={savingProfile}
              >
                <Save size={16} />
                <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Skills Management */}
        <div className="col-lg-5">
          {/* Skills I Can Teach */}
          <div className="sb-card p-4 bg-white mb-4">
            <h5 className="fw-bold text-dark mb-1">Skills You Can Teach</h5>
            <span className="text-muted small d-block mb-3">
              Add skills you feel confident sharing with fellow learners.
            </span>

            {/* List */}
            <div className="mb-3 d-flex flex-column gap-2">
              {offeredSkills.map((os) => (
                <div key={os.id || os.skillId} className="p-2 px-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold small text-dark d-block">{os.skill?.name || 'Skill'}</span>
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                      {os.proficiencyLevel} • {os.yearsOfExperience} yr(s) exp
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveOfferedSkill(os.skillId)}
                    className="btn btn-sm btn-link text-danger p-0"
                    title="Remove skill"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {offeredSkills.length === 0 && (
                <div className="text-muted small text-center py-2 border rounded border-dashed">
                  No teaching skills added yet.
                </div>
              )}
            </div>

            {/* Add Offered Skill Form */}
            <form onSubmit={handleAddOfferedSkill} className="border-top pt-3">
              <label className="form-label small fw-semibold text-dark mb-1">Add a Skill to Teach</label>
              <div className="mb-2">
                <select
                  className="form-select form-select-sm"
                  value={newOfferedSkillId}
                  onChange={(e) => setNewOfferedSkillId(e.target.value)}
                  required
                >
                  {availableSkills.map((sk) => (
                    <option key={sk.id} value={sk.id}>{sk.name} ({sk.category?.name})</option>
                  ))}
                </select>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <select
                    className="form-select form-select-sm"
                    value={newOfferedProficiency}
                    onChange={(e) => setNewOfferedProficiency(e.target.value)}
                  >
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    className="form-control form-control-sm"
                    placeholder="Years exp"
                    value={newOfferedYears}
                    onChange={(e) => setNewOfferedYears(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-sm btn-outline-primary w-100 d-inline-flex align-items-center justify-content-center gap-1">
                <Plus size={16} /> Add to Teaching Profile
              </button>
            </form>
          </div>

          {/* Skills I Want to Learn */}
          <div className="sb-card p-4 bg-white">
            <h5 className="fw-bold text-dark mb-1">Skills You Want to Learn</h5>
            <span className="text-muted small d-block mb-3">
              Topics and skills you’re looking to master next.
            </span>

            {/* List */}
            <div className="mb-3 d-flex flex-column gap-2">
              {wantedSkills.map((ws) => (
                <div key={ws.id || ws.skillId} className="p-2 px-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold small text-dark d-block">{ws.skill?.name || 'Skill'}</span>
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                      Priority: {ws.priority}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveWantedSkill(ws.skillId)}
                    className="btn btn-sm btn-link text-danger p-0"
                    title="Remove goal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {wantedSkills.length === 0 && (
                <div className="text-muted small text-center py-2 border rounded border-dashed">
                  No learning goals added yet.
                </div>
              )}
            </div>

            {/* Add Wanted Skill Form */}
            <form onSubmit={handleAddWantedSkill} className="border-top pt-3">
              <label className="form-label small fw-semibold text-dark mb-1">Add a Learning Wish</label>
              <div className="mb-2">
                <select
                  className="form-select form-select-sm"
                  value={newWantedSkillId}
                  onChange={(e) => setNewWantedSkillId(e.target.value)}
                  required
                >
                  {availableSkills.map((sk) => (
                    <option key={sk.id} value={sk.id}>{sk.name} ({sk.category?.name})</option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <select
                  className="form-select form-select-sm"
                  value={newWantedPriority}
                  onChange={(e) => setNewWantedPriority(e.target.value)}
                >
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="LOW">Casual Exploration</option>
                </select>
              </div>

              <button type="submit" className="btn btn-sm btn-outline-primary w-100 d-inline-flex align-items-center justify-content-center gap-1">
                <Plus size={16} /> Add to Learning Wishlist
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
