/**
 * SkillBridge Smart Matching Engine
 * Calculates transparent compatibility scores between users based on:
 * 1. Skill Complementarity (Mutual vs One-Way exchange) - Max 50 pts
 * 2. Experience Level & Teaching Proficiency - Max 15 pts
 * 3. Language Compatibility - Max 15 pts
 * 4. Availability & Schedule Overlap - Max 10 pts
 * 5. Platform Rating & Track Record - Max 10 pts
 */

const calculateMatchScore = (currentUser, candidateUser) => {
  if (!currentUser || !candidateUser || currentUser.id === candidateUser.id) {
    return null;
  }

  const myOffered = (currentUser.offeredSkills || []).map(s => s.skillId);
  const myWanted = (currentUser.wantedSkills || []).map(s => s.skillId);
  const theirOffered = (candidateUser.offeredSkills || []).map(s => s.skillId);
  const theirWanted = (candidateUser.wantedSkills || []).map(s => s.skillId);

  // 1. Skill Compatibility Analysis
  // Does current user offer what candidate wants?
  const iCanTeachThem = (currentUser.offeredSkills || []).filter(s => theirWanted.includes(s.skillId));
  // Does candidate offer what current user wants?
  const theyCanTeachMe = (candidateUser.offeredSkills || []).filter(s => myWanted.includes(s.skillId));

  let skillScore = 0;
  let isMutual = false;
  let matchedOfferedSkill = null; // What current user would teach
  let matchedWantedSkill = null;  // What candidate would teach

  if (iCanTeachThem.length > 0 && theyCanTeachMe.length > 0) {
    // Perfect 2-way mutual skill exchange
    skillScore = 50;
    isMutual = true;
    matchedOfferedSkill = iCanTeachThem[0].skill;
    matchedWantedSkill = theyCanTeachMe[0].skill;
  } else if (theyCanTeachMe.length > 0) {
    // One-way learning from candidate
    skillScore = 30;
    matchedWantedSkill = theyCanTeachMe[0].skill;
  } else if (iCanTeachThem.length > 0) {
    // One-way teaching to candidate
    skillScore = 25;
    matchedOfferedSkill = iCanTeachThem[0].skill;
  } else {
    // Category or general peer interest overlap
    const myOfferedCats = (currentUser.offeredSkills || []).map(s => s.skill?.categoryId).filter(Boolean);
    const theirWantedCats = (candidateUser.wantedSkills || []).map(s => s.skill?.categoryId).filter(Boolean);
    const hasCategoryOverlap = myOfferedCats.some(cat => theirWantedCats.includes(cat));
    skillScore = hasCategoryOverlap ? 15 : 5;
  }

  // 2. Experience Level (Max 15 pts)
  let experienceScore = 10;
  const expLevel = candidateUser.profile?.experienceLevel || 'INTERMEDIATE';
  if (expLevel === 'EXPERT') experienceScore = 15;
  else if (expLevel === 'ADVANCED') experienceScore = 13;
  else if (expLevel === 'INTERMEDIATE') experienceScore = 10;
  else experienceScore = 7;

  // 3. Language Compatibility (Max 15 pts)
  let languageScore = 8;
  const myLangs = (currentUser.profile?.languages || 'English').toLowerCase().split(/[\s,]+/);
  const theirLangs = (candidateUser.profile?.languages || 'English').toLowerCase().split(/[\s,]+/);
  const sharedLangs = myLangs.filter(l => l.length > 2 && theirLangs.includes(l));
  if (sharedLangs.length > 0) {
    languageScore = 15;
  }

  // 4. Availability Overlap (Max 10 pts)
  let availabilityScore = 6;
  const myAvail = (currentUser.profile?.availability || '').toLowerCase();
  const theirAvail = (candidateUser.profile?.availability || '').toLowerCase();
  if (myAvail && theirAvail) {
    const hasWeekend = (myAvail.includes('weekend') || myAvail.includes('satur') || myAvail.includes('sun')) &&
                       (theirAvail.includes('weekend') || theirAvail.includes('satur') || theirAvail.includes('sun'));
    const hasWeekday = (myAvail.includes('weekday') || myAvail.includes('evening') || myAvail.includes('pm')) &&
                       (theirAvail.includes('weekday') || theirAvail.includes('evening') || theirAvail.includes('pm'));
    if (hasWeekend || hasWeekday) {
      availabilityScore = 10;
    } else {
      availabilityScore = 7;
    }
  }

  // 5. Rating & Reviews Track Record (Max 10 pts)
  let ratingScore = 7;
  const rating = candidateUser.profile?.averageRating || 0;
  const totalReviews = candidateUser.profile?.totalReviews || 0;
  if (rating >= 4.8 && totalReviews >= 3) {
    ratingScore = 10;
  } else if (rating >= 4.5) {
    ratingScore = 9;
  } else if (rating >= 4.0) {
    ratingScore = 8;
  } else if (totalReviews === 0) {
    ratingScore = 7; // Welcoming new users
  } else {
    ratingScore = 5;
  }

  const totalScore = Math.min(100, Math.max(20, skillScore + experienceScore + languageScore + availabilityScore + ratingScore));

  return {
    candidate: candidateUser,
    matchPercentage: totalScore,
    isMutualMatch: isMutual,
    matchedOfferedSkill,
    matchedWantedSkill,
    scoreBreakdown: {
      skillComplementarity: skillScore,
      experienceLevel: experienceScore,
      languageCompatibility: languageScore,
      availabilityOverlap: availabilityScore,
      reputationAndRating: ratingScore
    }
  };
};

module.exports = {
  calculateMatchScore
};
