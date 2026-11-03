/**
 * Prisma Database Seeder
 * Populates PostgreSQL (Neon / Local) with SkillBridge sample data
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const seedData = require('./seedData');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SkillBridge database seeding...');

  // 1. Clean existing records in reverse dependency order
  console.log('🧹 Cleaning existing records...');
  try {
    await prisma.review.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.conversationParticipant.deleteMany({});
    await prisma.conversation.deleteMany({});
    await prisma.exchangeSession.deleteMany({});
    await prisma.exchangeRequest.deleteMany({});
    await prisma.userOfferedSkill.deleteMany({});
    await prisma.userWantedSkill.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.report.deleteMany({});
    await prisma.profile.deleteMany({});
    await prisma.skill.deleteMany({});
    await prisma.skillCategory.deleteMany({});
    await prisma.user.deleteMany({});
  } catch (err) {
    console.log('Note: Initial cleanup skipped or partially completed:', err.message);
  }

  // 2. Insert Categories
  console.log(`📁 Inserting ${seedData.categories.length} skill categories...`);
  for (const cat of seedData.categories) {
    await prisma.skillCategory.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon
      }
    });
  }

  // 3. Insert Skills
  console.log(`💡 Inserting ${seedData.skills.length} skills...`);
  for (const skill of seedData.skills) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: {},
      create: {
        id: skill.id,
        name: skill.name,
        slug: skill.slug,
        description: skill.description,
        icon: skill.icon,
        difficulty: skill.difficulty,
        categoryId: skill.categoryId
      }
    });
  }

  // 4. Insert Users, Profiles, Offered and Wanted Skills
  console.log(`👥 Inserting ${seedData.users.length} users and their profiles...`);
  for (const u of seedData.users) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(u.password, salt);

    const createdUser = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        role: u.role,
        isActive: u.isActive,
        isVerified: u.isVerified
      },
      create: {
        id: u.id,
        email: u.email,
        username: u.username,
        password: hashedPassword,
        role: u.role,
        isVerified: u.isVerified,
        isActive: u.isActive,
        profile: {
          create: {
            fullName: u.profile.fullName,
            avatarUrl: u.profile.avatarUrl,
            bio: u.profile.bio,
            location: u.profile.location,
            education: u.profile.education,
            occupation: u.profile.occupation,
            experienceLevel: u.profile.experienceLevel,
            languages: u.profile.languages,
            availability: u.profile.availability,
            githubUrl: u.profile.githubUrl || null,
            linkedinUrl: u.profile.linkedinUrl || null,
            portfolioUrl: u.profile.portfolioUrl || null,
            twitterUrl: u.profile.twitterUrl || null,
            averageRating: u.profile.averageRating,
            totalReviews: u.profile.totalReviews,
            completedExchanges: u.profile.completedExchanges,
            isMentor: u.profile.isMentor,
            mentorBio: u.profile.mentorBio || null,
            mentorHourlyRate: u.profile.mentorHourlyRate || 0.0
          }
        }
      }
    });

    // Add Offered Skills
    if (u.offeredSkills && u.offeredSkills.length > 0) {
      for (const off of u.offeredSkills) {
        await prisma.userOfferedSkill.create({
          data: {
            userId: createdUser.id,
            skillId: off.skillId,
            proficiencyLevel: off.proficiencyLevel,
            yearsOfExperience: off.yearsOfExperience,
            description: off.description
          }
        });
      }
    }

    // Add Wanted Skills
    if (u.wantedSkills && u.wantedSkills.length > 0) {
      for (const want of u.wantedSkills) {
        await prisma.userWantedSkill.create({
          data: {
            userId: createdUser.id,
            skillId: want.skillId,
            priority: want.priority,
            goals: want.goals
          }
        });
      }
    }
  }

  // 5. Insert Exchange Requests, Sessions, and Reviews
  console.log(`🤝 Inserting sample skill exchange requests and sessions...`);
  for (const ex of seedData.exchangeRequests) {
    const createdEx = await prisma.exchangeRequest.create({
      data: {
        id: ex.id,
        senderId: ex.senderId,
        receiverId: ex.receiverId,
        offeredSkillId: ex.offeredSkillId,
        wantedSkillId: ex.wantedSkillId,
        message: ex.message,
        status: ex.status,
        proposedSchedule: ex.proposedSchedule,
        matchScore: ex.matchScore,
        createdAt: ex.createdAt
      }
    });

    // Sessions
    if (ex.sessions && ex.sessions.length > 0) {
      for (const sess of ex.sessions) {
        await prisma.exchangeSession.create({
          data: {
            id: sess.id,
            exchangeId: createdEx.id,
            hostId: sess.hostId,
            attendeeId: sess.attendeeId,
            title: sess.title,
            description: sess.description,
            startTime: sess.startTime,
            endTime: sess.endTime,
            duration: sess.duration,
            status: sess.status,
            meetingLink: sess.meetingLink
          }
        });
      }
    }

    // Reviews
    if (ex.reviews && ex.reviews.length > 0) {
      for (const rev of ex.reviews) {
        await prisma.review.create({
          data: {
            id: rev.id,
            exchangeId: createdEx.id,
            reviewerId: rev.reviewerId,
            revieweeId: rev.revieweeId,
            rating: rev.rating,
            comment: rev.comment
          }
        });
      }
    }
  }

  // 6. Insert Conversations and Messages
  console.log(`💬 Inserting conversations and chat history...`);
  for (const conv of seedData.conversations) {
    const createdConv = await prisma.conversation.create({
      data: {
        id: conv.id,
        exchangeId: conv.exchangeId
      }
    });

    for (const pId of conv.participants) {
      await prisma.conversationParticipant.create({
        data: {
          conversationId: createdConv.id,
          userId: pId
        }
      });
    }

    for (const msg of conv.messages) {
      await prisma.message.create({
        data: {
          id: msg.id,
          conversationId: createdConv.id,
          senderId: msg.senderId,
          content: msg.content,
          createdAt: msg.createdAt
        }
      });
    }
  }

  // 7. Insert Notifications
  console.log(`🔔 Inserting notifications...`);
  for (const n of seedData.notifications) {
    await prisma.notification.create({
      data: {
        id: n.id,
        userId: n.userId,
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        isRead: n.isRead,
        createdAt: n.createdAt
      }
    });
  }

  // 8. Insert Reports
  console.log(`🚩 Inserting reports...`);
  for (const rep of seedData.reports) {
    await prisma.report.create({
      data: {
        id: rep.id,
        reporterId: rep.reporterId,
        reportedUserId: rep.reportedUserId,
        reason: rep.reason,
        details: rep.details,
        status: rep.status,
        createdAt: rep.createdAt
      }
    });
  }

  console.log('✅ SkillBridge database successfully seeded!');
  console.log('========================================================');
  console.log('Admin Account: admin@skillbridge.io / AdminSecurePassword2026!');
  console.log('Mentor Account 1: alex.morgan@example.com / Password123!');
  console.log('Mentor Account 2: elena.design@example.com / Password123!');
  console.log('Student Account: liam.oc@example.com / Password123!');
  console.log('========================================================');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
