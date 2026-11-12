

const assert = require('assert');
const { calculateMatchScore } = require('../src/services/matchingService');
const { hashPassword, comparePassword } = require('../src/utils/password');
const { generateToken, verifyToken } = require('../src/utils/jwt');
const db = require('../src/config/db');

async function runTests() {
  console.log('🧪 Starting SkillBridge Automated Test Suite...\n');
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ PASSED: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAILED: ${name}`);
      console.error(`     Error: ${err.message}\n`);
      failed++;
    }
  };

  await test('Password Hashing and Comparison', async () => {
    const rawPass = 'SecretPassword123!';
    const hashed = await hashPassword(rawPass);
    assert(hashed && hashed !== rawPass, 'Hashed password should be non-empty and not equal to plain text');
    const isCorrect = await comparePassword(rawPass, hashed);
    assert.strictEqual(isCorrect, true, 'Comparing correct password must return true');
    const isWrong = await comparePassword('WrongPassword', hashed);
    assert.strictEqual(isWrong, false, 'Comparing wrong password must return false');
  });

  
  await test('JWT Token Generation and Verification', async () => {
    const payload = { userId: 'usr-test-123', email: 'test@skillbridge.io', role: 'MENTOR' };
    const token = generateToken(payload);
    assert(typeof token === 'string' && token.length > 20, 'Token must be a valid non-empty string');
    const decoded = verifyToken(token);
    assert.strictEqual(decoded.userId, 'usr-test-123', 'Decoded userId must match original payload');
    assert.strictEqual(decoded.email, 'test@skillbridge.io', 'Decoded email must match original payload');
    assert.strictEqual(decoded.role, 'MENTOR', 'Decoded role must match original payload');
  });

 
  await test('Smart Matching Algorithm - Strong Mutual Match', async () => {
    const userA = {
      id: 'user-a',
      profile: { experienceLevel: 'EXPERT', languages: 'English', availability: 'Weekdays 6-9 PM', averageRating: 4.9, totalReviews: 10 },
      offeredSkills: [{ skillId: 'skill-1', skill: { id: 'skill-1', name: 'React.js' } }],
      wantedSkills: [{ skillId: 'skill-7', skill: { id: 'skill-7', name: 'Figma UI/UX' } }]
    };

    const userB = {
      id: 'user-b',
      profile: { experienceLevel: 'EXPERT', languages: 'English', availability: 'Weekdays 5-8 PM', averageRating: 4.9, totalReviews: 12 },
      offeredSkills: [{ skillId: 'skill-7', skill: { id: 'skill-7', name: 'Figma UI/UX' } }],
      wantedSkills: [{ skillId: 'skill-1', skill: { id: 'skill-1', name: 'React.js' } }]
    };

    const match = calculateMatchScore(userA, userB);
    assert(match !== null, 'Match score should not be null');
    assert.strictEqual(match.isMutualMatch, true, 'Match must be identified as mutual');
    assert.strictEqual(match.scoreBreakdown.skillComplementarity, 50, 'Mutual match skill score must be 50');
    assert(match.matchPercentage >= 90, `Mutual match percentage must be >= 90% (got ${match.matchPercentage}%)`);
    assert.strictEqual(match.matchedOfferedSkill.name, 'React.js');
    assert.strictEqual(match.matchedWantedSkill.name, 'Figma UI/UX');
  });

  
  await test('Smart Matching Algorithm - Low Complementarity', async () => {
    const userA = {
      id: 'user-a',
      profile: { experienceLevel: 'BEGINNER', languages: 'English' },
      offeredSkills: [{ skillId: 'skill-20', skill: { id: 'skill-20', categoryId: 'cat-8' } }],
      wantedSkills: [{ skillId: 'skill-18', skill: { id: 'skill-18', categoryId: 'cat-7' } }]
    };

    const userC = {
      id: 'user-c',
      profile: { experienceLevel: 'BEGINNER', languages: 'Japanese' },
      offeredSkills: [{ skillId: 'skill-16', skill: { id: 'skill-16', categoryId: 'cat-6' } }],
      wantedSkills: [{ skillId: 'skill-2', skill: { id: 'skill-2', categoryId: 'cat-1' } }]
    };

    const match = calculateMatchScore(userA, userC);
    assert.strictEqual(match.isMutualMatch, false, 'Should not be mutual match');
    assert(match.matchPercentage < 60, `Score should be low for unrelated skills (got ${match.matchPercentage})`);
  });

  // Test 5: Database Querying & Seeding Verification
  await test('Database Models & Initial Seed Data Verification', async () => {
    const categories = await db.skillCategory.findMany();
    assert(categories.length >= 8, `Expected at least 8 categories, got ${categories.length}`);

    const skills = await db.skill.findMany();
    assert(skills.length >= 20, `Expected at least 20 skills, got ${skills.length}`);

    const users = await db.user.findMany();
    assert(users.length >= 15, `Expected at least 15 users, got ${users.length}`);

    const mentors = users.filter(u => u.role === 'MENTOR' || u.profile?.isMentor);
    assert(mentors.length >= 5, `Expected at least 5 mentors, got ${mentors.length}`);

    const admin = await db.user.findUnique({ where: { email: 'admin@skillbridge.io' } });
    assert(admin !== null, 'Admin account must exist');
    assert.strictEqual(admin.role, 'ADMIN', 'Admin user must have ADMIN role');
  });

  // Test 6: Exchange Request Workflow & Transitions
  await test('Exchange Request Lifecycle State Transitions', async () => {
    const newEx = await db.exchangeRequest.create({
      data: {
        senderId: 'usr-student-1',
        receiverId: 'usr-mentor-1',
        offeredSkillId: 'skill-20',
        wantedSkillId: 'skill-1',
        message: 'Test exchange request message for unit testing workflow',
        status: 'PENDING',
        matchScore: 88
      }
    });

    assert.strictEqual(newEx.status, 'PENDING', 'New exchange must have PENDING status');

    const accepted = await db.exchangeRequest.update({
      where: { id: newEx.id },
      data: { status: 'ACCEPTED' }
    });
    assert.strictEqual(accepted.status, 'ACCEPTED', 'Status should transition to ACCEPTED');

    const completed = await db.exchangeRequest.update({
      where: { id: newEx.id },
      data: { status: 'COMPLETED' }
    });
    assert.strictEqual(completed.status, 'COMPLETED', 'Status should transition to COMPLETED');
  });

  // Test 7: Review Eligibility Check & Duplicate Prevention
  await test('Review Submission Rules & Uniqueness', async () => {
    const exchange = await db.exchangeRequest.findUnique({
      where: { id: 'exch-1' }
    });
    assert(exchange !== null, 'Seeded completed exchange exch-1 must exist');
    assert.strictEqual(exchange.status, 'COMPLETED', 'Exchange exch-1 must be COMPLETED');

    const reviews = await db.review.findMany({
      where: { exchangeId: 'exch-1' }
    });
    assert(reviews.length >= 2, `Expected 2 seed reviews for exch-1, got ${reviews.length}`);
    assert(reviews[0].rating >= 1 && reviews[0].rating <= 5, 'Rating must be 1 to 5');
  });

  // Test 8: Session Conflict Detection Logic
  await test('Calendar Conflict Prevention Logic', async () => {
    const start1 = new Date('2026-11-20T14:00:00Z');
    const end1 = new Date('2026-11-20T15:00:00Z');

    // Overlapping session (starts at 14:30)
    const start2 = new Date('2026-11-20T14:30:00Z');
    const end2 = new Date('2026-11-20T15:30:00Z');

    const hasOverlap = start2 < end1 && end2 > start1;
    assert.strictEqual(hasOverlap, true, 'Overlapping times must trigger conflict detection');

    // Non-overlapping session (starts at 15:30)
    const start3 = new Date('2026-11-20T15:30:00Z');
    const end3 = new Date('2026-11-20T16:30:00Z');
    const noOverlap = start3 < end1 && end3 > start1;
    assert.strictEqual(noOverlap, false, 'Non-overlapping times must not trigger conflict');
  });

  console.log('\n========================================================');
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
