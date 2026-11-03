/**
 * Database Client Configuration
 * Supports PostgreSQL via Prisma ORM (with Neon support)
 * Features automatic resilient fallback to an active in-memory / JSON store
 * when PostgreSQL is offline or DATABASE_URL is unavailable.
 */

const fs = require('fs');
const path = require('path');
const seedData = require('../../prisma/seedData');

let prismaClient = null;
let useFallback = false;

// Attempt to load PrismaClient if installed
try {
  const { PrismaClient } = require('@prisma/client');
  if (process.env.DATABASE_URL && !process.env.USE_MEMORY_DB) {
    prismaClient = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
    });
  } else {
    useFallback = true;
  }
} catch (e) {
  useFallback = true;
}

// In-Memory Storage Engine simulating Prisma API
class MemoryStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.categories = JSON.parse(JSON.stringify(seedData.categories || []));
    this.skills = JSON.parse(JSON.stringify(seedData.skills || []));
    this.users = JSON.parse(JSON.stringify(seedData.users || []));
    this.exchangeRequests = JSON.parse(JSON.stringify(seedData.exchangeRequests || []));
    this.conversations = JSON.parse(JSON.stringify(seedData.conversations || []));
    this.notifications = JSON.parse(JSON.stringify(seedData.notifications || []));
    this.reports = JSON.parse(JSON.stringify(seedData.reports || []));
    this.passwordResetTokens = [];
    this.emailVerificationTokens = [];

    // Flatten user offered & wanted skills and profiles
    this.profiles = [];
    this.offeredSkills = [];
    this.wantedSkills = [];
    this.sessions = [];
    this.reviews = [];
    this.messages = [];
    this.conversationParticipants = [];

    this.users.forEach(u => {
      if (u.profile) {
        this.profiles.push({
          id: 'prof-' + u.id,
          userId: u.id,
          ...u.profile,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      if (u.offeredSkills) {
        u.offeredSkills.forEach((off, idx) => {
          this.offeredSkills.push({
            id: `off-${u.id}-${idx}`,
            userId: u.id,
            skillId: off.skillId,
            proficiencyLevel: off.proficiencyLevel || 'INTERMEDIATE',
            yearsOfExperience: off.yearsOfExperience || 1,
            description: off.description || '',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
      }
      if (u.wantedSkills) {
        u.wantedSkills.forEach((want, idx) => {
          this.wantedSkills.push({
            id: `want-${u.id}-${idx}`,
            userId: u.id,
            skillId: want.skillId,
            priority: want.priority || 'MEDIUM',
            goals: want.goals || '',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
      }
    });

    this.exchangeRequests.forEach(ex => {
      if (ex.sessions) {
        ex.sessions.forEach(sess => {
          this.sessions.push({
            ...sess,
            exchangeId: ex.id,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
      }
      if (ex.reviews) {
        ex.reviews.forEach(rev => {
          this.reviews.push({
            ...rev,
            exchangeId: ex.id,
            isModerated: false,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
      }
    });

    this.conversations.forEach(c => {
      if (c.participants) {
        c.participants.forEach(pId => {
          this.conversationParticipants.push({
            id: `cp-${c.id}-${pId}`,
            conversationId: c.id,
            userId: pId,
            lastReadAt: new Date()
          });
        });
      }
      if (c.messages) {
        c.messages.forEach(m => {
          this.messages.push({
            ...m,
            conversationId: c.id,
            isRead: true,
            updatedAt: new Date()
          });
        });
      }
    });
  }

  // Helper to generate IDs
  uuid(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }
}

const memoryDb = new MemoryStore();

// Fallback Prisma-like wrapper
const mockPrisma = {
  $connect: async () => true,
  $disconnect: async () => true,

  user: {
    findUnique: async ({ where, include }) => {
      let u = memoryDb.users.find(item => {
        if (where.id && item.id === where.id) return true;
        if (where.email && item.email.toLowerCase() === where.email.toLowerCase()) return true;
        if (where.username && item.username.toLowerCase() === where.username.toLowerCase()) return true;
        return false;
      });
      if (!u) return null;
      return mockPrisma._hydrateUser(u, include);
    },
    findFirst: async ({ where = {}, include }) => {
      const results = await mockPrisma.user.findMany({ where, include, take: 1 });
      return results[0] || null;
    },
    findMany: async ({ where = {}, include, orderBy, take, skip } = {}) => {
      let list = memoryDb.users.filter(u => {
        if (where.id && where.id !== u.id) return false;
        if (where.role && where.role !== u.role) return false;
        if (where.isActive !== undefined && where.isActive !== u.isActive) return false;
        if (where.isVerified !== undefined && where.isVerified !== u.isVerified) return false;
        if (where.NOT && where.NOT.id && where.NOT.id === u.id) return false;
        if (where.OR && Array.isArray(where.OR)) {
          const orMatch = where.OR.some(cond => {
            if (cond.email && u.email.toLowerCase().includes(cond.email.contains?.toLowerCase() || '')) return true;
            if (cond.username && u.username.toLowerCase().includes(cond.username.contains?.toLowerCase() || '')) return true;
            if (cond.profile?.fullName && u.profile?.fullName?.toLowerCase().includes(cond.profile.fullName.contains?.toLowerCase() || '')) return true;
            return false;
          });
          if (!orMatch) return false;
        }
        return true;
      });

      if (skip) list = list.slice(skip);
      if (take) list = list.slice(0, take);

      return list.map(u => mockPrisma._hydrateUser(u, include));
    },
    create: async ({ data, include }) => {
      const id = data.id || memoryDb.uuid('usr');
      const newUser = {
        id,
        email: data.email,
        username: data.username,
        password: data.password,
        role: data.role || 'USER',
        isVerified: data.isVerified !== undefined ? data.isVerified : false,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (data.profile?.create) {
        const prof = {
          id: memoryDb.uuid('prof'),
          userId: id,
          fullName: data.profile.create.fullName,
          avatarUrl: data.profile.create.avatarUrl || null,
          bio: data.profile.create.bio || '',
          location: data.profile.create.location || '',
          education: data.profile.create.education || '',
          occupation: data.profile.create.occupation || '',
          experienceLevel: data.profile.create.experienceLevel || 'INTERMEDIATE',
          languages: data.profile.create.languages || 'English',
          availability: data.profile.create.availability || '',
          averageRating: 0.0,
          totalReviews: 0,
          completedExchanges: 0,
          isMentor: data.profile.create.isMentor || false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        memoryDb.profiles.push(prof);
        newUser.profile = prof;
      }

      memoryDb.users.push(newUser);
      return mockPrisma._hydrateUser(newUser, include);
    },
    update: async ({ where, data, include }) => {
      const user = memoryDb.users.find(u => u.id === where.id || u.email === where.email);
      if (!user) throw new Error('User not found');
      if (data.password !== undefined) user.password = data.password;
      if (data.role !== undefined) user.role = data.role;
      if (data.isActive !== undefined) user.isActive = data.isActive;
      if (data.isVerified !== undefined) user.isVerified = data.isVerified;
      user.updatedAt = new Date();

      if (data.profile?.update) {
        let prof = memoryDb.profiles.find(p => p.userId === user.id);
        if (prof) {
          Object.assign(prof, data.profile.update, { updatedAt: new Date() });
          user.profile = prof;
        }
      }

      return mockPrisma._hydrateUser(user, include);
    },
    count: async ({ where = {} } = {}) => {
      const users = await mockPrisma.user.findMany({ where });
      return users.length;
    },
    delete: async ({ where }) => {
      const idx = memoryDb.users.findIndex(u => u.id === where.id);
      if (idx !== -1) {
        const deleted = memoryDb.users.splice(idx, 1)[0];
        memoryDb.profiles = memoryDb.profiles.filter(p => p.userId !== deleted.id);
        memoryDb.offeredSkills = memoryDb.offeredSkills.filter(s => s.userId !== deleted.id);
        memoryDb.wantedSkills = memoryDb.wantedSkills.filter(s => s.userId !== deleted.id);
        return deleted;
      }
      return null;
    }
  },

  profile: {
    findUnique: async ({ where }) => {
      return memoryDb.profiles.find(p => p.userId === where.userId || p.id === where.id) || null;
    },
    update: async ({ where, data }) => {
      const prof = memoryDb.profiles.find(p => p.userId === where.userId || p.id === where.id);
      if (!prof) throw new Error('Profile not found');
      Object.assign(prof, data, { updatedAt: new Date() });
      const user = memoryDb.users.find(u => u.id === prof.userId);
      if (user) user.profile = prof;
      return prof;
    }
  },

  skillCategory: {
    findMany: async ({ include } = {}) => {
      return memoryDb.categories.map(cat => {
        if (include?.skills) {
          return {
            ...cat,
            skills: memoryDb.skills.filter(s => s.categoryId === cat.id)
          };
        }
        return cat;
      });
    },
    findUnique: async ({ where }) => {
      return memoryDb.categories.find(c => c.id === where.id || c.slug === where.slug) || null;
    },
    create: async ({ data }) => {
      const newCat = {
        id: data.id || memoryDb.uuid('cat'),
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: data.description || '',
        icon: data.icon || 'Folder',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryDb.categories.push(newCat);
      return newCat;
    },
    update: async ({ where, data }) => {
      const cat = memoryDb.categories.find(c => c.id === where.id);
      if (!cat) throw new Error('Category not found');
      Object.assign(cat, data, { updatedAt: new Date() });
      return cat;
    },
    delete: async ({ where }) => {
      const idx = memoryDb.categories.findIndex(c => c.id === where.id);
      if (idx !== -1) {
        return memoryDb.categories.splice(idx, 1)[0];
      }
      return null;
    },
    count: async () => memoryDb.categories.length
  },

  skill: {
    findMany: async ({ where = {}, include } = {}) => {
      let list = memoryDb.skills.filter(s => {
        if (where.categoryId && s.categoryId !== where.categoryId) return false;
        if (where.difficulty && s.difficulty !== where.difficulty) return false;
        if (where.name?.contains && !s.name.toLowerCase().includes(where.name.contains.toLowerCase())) return false;
        return true;
      });

      return list.map(s => {
        const item = { ...s };
        if (include?.category) {
          item.category = memoryDb.categories.find(c => c.id === s.categoryId);
        }
        if (include?.offeredBy) {
          item.offeredBy = memoryDb.offeredSkills.filter(off => off.skillId === s.id);
        }
        if (include?.wantedBy) {
          item.wantedBy = memoryDb.wantedSkills.filter(want => want.skillId === s.id);
        }
        return item;
      });
    },
    findUnique: async ({ where, include }) => {
      const s = memoryDb.skills.find(item => item.id === where.id || item.slug === where.slug);
      if (!s) return null;
      const item = { ...s };
      if (include?.category) {
        item.category = memoryDb.categories.find(c => c.id === s.categoryId);
      }
      return item;
    },
    create: async ({ data, include }) => {
      const newSkill = {
        id: data.id || memoryDb.uuid('skill'),
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: data.description,
        icon: data.icon || 'BookOpen',
        difficulty: data.difficulty || 'INTERMEDIATE',
        categoryId: data.categoryId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryDb.skills.push(newSkill);
      if (include?.category) {
        newSkill.category = memoryDb.categories.find(c => c.id === newSkill.categoryId);
      }
      return newSkill;
    },
    update: async ({ where, data, include }) => {
      const s = memoryDb.skills.find(item => item.id === where.id);
      if (!s) throw new Error('Skill not found');
      Object.assign(s, data, { updatedAt: new Date() });
      if (include?.category) {
        s.category = memoryDb.categories.find(c => c.id === s.categoryId);
      }
      return s;
    },
    delete: async ({ where }) => {
      const idx = memoryDb.skills.findIndex(s => s.id === where.id);
      if (idx !== -1) {
        return memoryDb.skills.splice(idx, 1)[0];
      }
      return null;
    },
    count: async () => memoryDb.skills.length
  },

  userOfferedSkill: {
    findMany: async ({ where = {}, include } = {}) => {
      let list = memoryDb.offeredSkills.filter(s => {
        if (where.userId && s.userId !== where.userId) return false;
        if (where.skillId && s.skillId !== where.skillId) return false;
        return true;
      });
      return list.map(item => {
        const res = { ...item };
        if (include?.skill) {
          res.skill = memoryDb.skills.find(sk => sk.id === item.skillId);
          if (res.skill && include.skill.include?.category) {
            res.skill = {
              ...res.skill,
              category: memoryDb.categories.find(c => c.id === res.skill.categoryId)
            };
          }
        }
        if (include?.user) {
          res.user = mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === item.userId), { profile: true });
        }
        return res;
      });
    },
    create: async ({ data, include }) => {
      const existing = memoryDb.offeredSkills.find(s => s.userId === data.userId && s.skillId === data.skillId);
      if (existing) {
        Object.assign(existing, data, { updatedAt: new Date() });
        return existing;
      }
      const newItem = {
        id: memoryDb.uuid('off'),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryDb.offeredSkills.push(newItem);
      if (include?.skill) {
        newItem.skill = memoryDb.skills.find(sk => sk.id === newItem.skillId);
      }
      return newItem;
    },
    delete: async ({ where }) => {
      const idx = memoryDb.offeredSkills.findIndex(s => {
        if (where.id && s.id === where.id) return true;
        if (where.userId_skillId && s.userId === where.userId_skillId.userId && s.skillId === where.userId_skillId.skillId) return true;
        return false;
      });
      if (idx !== -1) return memoryDb.offeredSkills.splice(idx, 1)[0];
      return null;
    }
  },

  userWantedSkill: {
    findMany: async ({ where = {}, include } = {}) => {
      let list = memoryDb.wantedSkills.filter(s => {
        if (where.userId && s.userId !== where.userId) return false;
        if (where.skillId && s.skillId !== where.skillId) return false;
        return true;
      });
      return list.map(item => {
        const res = { ...item };
        if (include?.skill) {
          res.skill = memoryDb.skills.find(sk => sk.id === item.skillId);
          if (res.skill && include.skill.include?.category) {
            res.skill = {
              ...res.skill,
              category: memoryDb.categories.find(c => c.id === res.skill.categoryId)
            };
          }
        }
        return res;
      });
    },
    create: async ({ data, include }) => {
      const existing = memoryDb.wantedSkills.find(s => s.userId === data.userId && s.skillId === data.skillId);
      if (existing) {
        Object.assign(existing, data, { updatedAt: new Date() });
        return existing;
      }
      const newItem = {
        id: memoryDb.uuid('want'),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryDb.wantedSkills.push(newItem);
      if (include?.skill) {
        newItem.skill = memoryDb.skills.find(sk => sk.id === newItem.skillId);
      }
      return newItem;
    },
    delete: async ({ where }) => {
      const idx = memoryDb.wantedSkills.findIndex(s => {
        if (where.id && s.id === where.id) return true;
        if (where.userId_skillId && s.userId === where.userId_skillId.userId && s.skillId === where.userId_skillId.skillId) return true;
        return false;
      });
      if (idx !== -1) return memoryDb.wantedSkills.splice(idx, 1)[0];
      return null;
    }
  },

  exchangeRequest: {
    findFirst: async ({ where = {}, include } = {}) => {
      const results = await mockPrisma.exchangeRequest.findMany({ where, include });
      return results[0] || null;
    },
    findMany: async ({ where = {}, include, orderBy } = {}) => {
      let list = memoryDb.exchangeRequests.filter(ex => {
        if (where.id && ex.id !== where.id) return false;
        if (where.senderId && ex.senderId !== where.senderId) return false;
        if (where.receiverId && ex.receiverId !== where.receiverId) return false;
        if (where.status && ex.status !== where.status) return false;
        if (where.OR && Array.isArray(where.OR)) {
          const match = where.OR.some(cond => {
            if (cond.senderId && ex.senderId === cond.senderId) return true;
            if (cond.receiverId && ex.receiverId === cond.receiverId) return true;
            return false;
          });
          if (!match) return false;
        }
        return true;
      });

      return list.map(ex => mockPrisma._hydrateExchange(ex, include));
    },
    findUnique: async ({ where, include }) => {
      const ex = memoryDb.exchangeRequests.find(item => item.id === where.id);
      if (!ex) return null;
      return mockPrisma._hydrateExchange(ex, include);
    },
    create: async ({ data, include }) => {
      const newEx = {
        id: data.id || memoryDb.uuid('exch'),
        senderId: data.senderId,
        receiverId: data.receiverId,
        offeredSkillId: data.offeredSkillId,
        wantedSkillId: data.wantedSkillId,
        message: data.message,
        status: data.status || 'PENDING',
        proposedSchedule: data.proposedSchedule || '',
        matchScore: data.matchScore || 85,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryDb.exchangeRequests.unshift(newEx);
      return mockPrisma._hydrateExchange(newEx, include);
    },
    update: async ({ where, data, include }) => {
      const ex = memoryDb.exchangeRequests.find(item => item.id === where.id);
      if (!ex) throw new Error('Exchange request not found');
      Object.assign(ex, data, { updatedAt: new Date() });
      return mockPrisma._hydrateExchange(ex, include);
    },
    count: async ({ where = {} } = {}) => {
      const res = await mockPrisma.exchangeRequest.findMany({ where });
      return res.length;
    }
  },

  exchangeSession: {
    findFirst: async ({ where = {}, include } = {}) => {
      const results = await mockPrisma.exchangeSession.findMany({ where, include });
      return results[0] || null;
    },
    findMany: async ({ where = {}, include, orderBy } = {}) => {
      let list = memoryDb.sessions.filter(sess => {
        if (where.id && sess.id !== where.id) return false;
        if (where.exchangeId && sess.exchangeId !== where.exchangeId) return false;
        if (where.hostId && sess.hostId !== where.hostId) return false;
        if (where.attendeeId && sess.attendeeId !== where.attendeeId) return false;
        if (where.status && sess.status !== where.status) return false;
        if (where.OR && Array.isArray(where.OR)) {
          const match = where.OR.some(c => (c.hostId && sess.hostId === c.hostId) || (c.attendeeId && sess.attendeeId === c.attendeeId));
          if (!match) return false;
        }
        return true;
      });

      return list.map(sess => {
        const item = { ...sess };
        if (include?.host) item.host = mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === sess.hostId), { profile: true });
        if (include?.attendee) item.attendee = mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === sess.attendeeId), { profile: true });
        if (include?.exchange) item.exchange = mockPrisma._hydrateExchange(memoryDb.exchangeRequests.find(e => e.id === sess.exchangeId), {});
        return item;
      });
    },
    findUnique: async ({ where, include }) => {
      const sess = memoryDb.sessions.find(s => s.id === where.id);
      if (!sess) return null;
      const item = { ...sess };
      if (include?.host) item.host = mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === sess.hostId), { profile: true });
      if (include?.attendee) item.attendee = mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === sess.attendeeId), { profile: true });
      return item;
    },
    create: async ({ data, include }) => {
      const newSess = {
        id: data.id || memoryDb.uuid('sess'),
        exchangeId: data.exchangeId,
        hostId: data.hostId,
        attendeeId: data.attendeeId,
        title: data.title,
        description: data.description || '',
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        duration: data.duration || 60,
        meetingLink: data.meetingLink || 'https://meet.jit.si/skillbridge-' + Math.random().toString(36).substring(7),
        status: data.status || 'SCHEDULED',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryDb.sessions.push(newSess);
      return newSess;
    },
    update: async ({ where, data, include }) => {
      const sess = memoryDb.sessions.find(s => s.id === where.id);
      if (!sess) throw new Error('Session not found');
      if (data.startTime) data.startTime = new Date(data.startTime);
      if (data.endTime) data.endTime = new Date(data.endTime);
      Object.assign(sess, data, { updatedAt: new Date() });
      return sess;
    },
    delete: async ({ where }) => {
      const idx = memoryDb.sessions.findIndex(s => s.id === where.id);
      if (idx !== -1) return memoryDb.sessions.splice(idx, 1)[0];
      return null;
    },
    count: async ({ where = {} } = {}) => {
      const res = await mockPrisma.exchangeSession.findMany({ where });
      return res.length;
    }
  },

  conversation: {
    findMany: async ({ where = {}, include } = {}) => {
      let list = memoryDb.conversations.filter(c => {
        if (where.participants?.some?.userId) {
          const p = memoryDb.conversationParticipants.find(cp => cp.conversationId === c.id && cp.userId === where.participants.some.userId);
          if (!p) return false;
        }
        return true;
      });

      return list.map(c => mockPrisma._hydrateConversation(c, include));
    },
    findFirst: async ({ where = {}, include } = {}) => {
      const list = await mockPrisma.conversation.findMany({ where, include });
      return list[0] || null;
    },
    findUnique: async ({ where, include }) => {
      const c = memoryDb.conversations.find(item => item.id === where.id || (where.exchangeId && item.exchangeId === where.exchangeId));
      if (!c) return null;
      return mockPrisma._hydrateConversation(c, include);
    },
    create: async ({ data, include }) => {
      const newConv = {
        id: data.id || memoryDb.uuid('conv'),
        exchangeId: data.exchangeId || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryDb.conversations.push(newConv);

      if (data.participants?.create) {
        data.participants.create.forEach(p => {
          memoryDb.conversationParticipants.push({
            id: memoryDb.uuid('cp'),
            conversationId: newConv.id,
            userId: p.userId,
            lastReadAt: new Date()
          });
        });
      }

      return mockPrisma._hydrateConversation(newConv, include);
    }
  },

  message: {
    findMany: async ({ where = {}, include, orderBy } = {}) => {
      let list = memoryDb.messages.filter(m => {
        if (where.conversationId && m.conversationId !== where.conversationId) return false;
        return true;
      });
      return list.map(m => {
        const item = { ...m };
        if (include?.sender) {
          item.sender = mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === m.senderId), { profile: true });
        }
        return item;
      });
    },
    create: async ({ data, include }) => {
      const newMsg = {
        id: data.id || memoryDb.uuid('msg'),
        conversationId: data.conversationId,
        senderId: data.senderId,
        content: data.content,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryDb.messages.push(newMsg);
      // Touch conversation updatedAt
      const conv = memoryDb.conversations.find(c => c.id === data.conversationId);
      if (conv) conv.updatedAt = new Date();

      const item = { ...newMsg };
      if (include?.sender) {
        item.sender = mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === newMsg.senderId), { profile: true });
      }
      return item;
    },
    updateMany: async ({ where, data }) => {
      let count = 0;
      memoryDb.messages.forEach(m => {
        if (where.conversationId && m.conversationId === where.conversationId) {
          if (where.senderId?.not && m.senderId === where.senderId.not) return;
          Object.assign(m, data);
          count++;
        }
      });
      return { count };
    }
  },

  review: {
    findMany: async ({ where = {}, include, orderBy } = {}) => {
      let list = memoryDb.reviews.filter(r => {
        if (where.revieweeId && r.revieweeId !== where.revieweeId) return false;
        if (where.reviewerId && r.reviewerId !== where.reviewerId) return false;
        if (where.exchangeId && r.exchangeId !== where.exchangeId) return false;
        if (where.isModerated !== undefined && r.isModerated !== where.isModerated) return false;
        return true;
      });

      return list.map(r => {
        const item = { ...r };
        if (include?.reviewer) item.reviewer = mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === r.reviewerId), { profile: true });
        if (include?.reviewee) item.reviewee = mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === r.revieweeId), { profile: true });
        if (include?.exchange) item.exchange = mockPrisma._hydrateExchange(memoryDb.exchangeRequests.find(e => e.id === r.exchangeId), {});
        return item;
      });
    },
    findFirst: async ({ where, include }) => {
      const list = await mockPrisma.review.findMany({ where, include });
      return list[0] || null;
    },
    create: async ({ data, include }) => {
      const newRev = {
        id: data.id || memoryDb.uuid('rev'),
        exchangeId: data.exchangeId,
        reviewerId: data.reviewerId,
        revieweeId: data.revieweeId,
        rating: data.rating,
        comment: data.comment,
        isModerated: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryDb.reviews.unshift(newRev);

      // Recompute reviewee's average rating
      const allForReviewee = memoryDb.reviews.filter(r => r.revieweeId === data.revieweeId);
      const avg = allForReviewee.reduce((acc, cur) => acc + cur.rating, 0) / allForReviewee.length;
      const prof = memoryDb.profiles.find(p => p.userId === data.revieweeId);
      if (prof) {
        prof.averageRating = Number(avg.toFixed(2));
        prof.totalReviews = allForReviewee.length;
      }

      return newRev;
    },
    update: async ({ where, data }) => {
      const r = memoryDb.reviews.find(item => item.id === where.id);
      if (!r) throw new Error('Review not found');
      Object.assign(r, data, { updatedAt: new Date() });
      return r;
    },
    delete: async ({ where }) => {
      const idx = memoryDb.reviews.findIndex(r => r.id === where.id);
      if (idx !== -1) return memoryDb.reviews.splice(idx, 1)[0];
      return null;
    },
    count: async () => memoryDb.reviews.length
  },

  notification: {
    findMany: async ({ where = {}, orderBy, take } = {}) => {
      let list = memoryDb.notifications.filter(n => {
        if (where.userId && n.userId !== where.userId) return false;
        if (where.isRead !== undefined && n.isRead !== where.isRead) return false;
        return true;
      });
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (take) list = list.slice(0, take);
      return list;
    },
    create: async ({ data }) => {
      const newNotif = {
        id: data.id || memoryDb.uuid('notif'),
        userId: data.userId,
        type: data.type || 'SYSTEM',
        title: data.title,
        message: data.message,
        link: data.link || null,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryDb.notifications.unshift(newNotif);
      return newNotif;
    },
    update: async ({ where, data }) => {
      const n = memoryDb.notifications.find(item => item.id === where.id);
      if (!n) throw new Error('Notification not found');
      Object.assign(n, data, { updatedAt: new Date() });
      return n;
    },
    updateMany: async ({ where, data }) => {
      let count = 0;
      memoryDb.notifications.forEach(n => {
        if (where.userId && n.userId === where.userId) {
          Object.assign(n, data);
          count++;
        }
      });
      return { count };
    },
    count: async ({ where = {} } = {}) => {
      const list = await mockPrisma.notification.findMany({ where });
      return list.length;
    }
  },

  report: {
    findMany: async ({ where = {}, include } = {}) => {
      let list = memoryDb.reports.filter(r => {
        if (where.status && r.status !== where.status) return false;
        return true;
      });
      return list.map(r => {
        const item = { ...r };
        if (include?.reporter) item.reporter = mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === r.reporterId), { profile: true });
        if (include?.reportedUser) item.reportedUser = mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === r.reportedUserId), { profile: true });
        return item;
      });
    },
    create: async ({ data }) => {
      const newRep = {
        id: memoryDb.uuid('rep'),
        reporterId: data.reporterId,
        reportedUserId: data.reportedUserId,
        reason: data.reason,
        details: data.details,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryDb.reports.unshift(newRep);
      return newRep;
    },
    update: async ({ where, data }) => {
      const rep = memoryDb.reports.find(r => r.id === where.id);
      if (!rep) throw new Error('Report not found');
      Object.assign(rep, data, { updatedAt: new Date() });
      return rep;
    },
    count: async ({ where = {} } = {}) => {
      const list = await mockPrisma.report.findMany({ where });
      return list.length;
    }
  },

  passwordResetToken: {
    findUnique: async ({ where }) => {
      return memoryDb.passwordResetTokens.find(t => t.token === where.token) || null;
    },
    create: async ({ data }) => {
      const tokenObj = {
        id: memoryDb.uuid('prt'),
        userId: data.userId,
        token: data.token,
        expiresAt: new Date(data.expiresAt),
        createdAt: new Date()
      };
      memoryDb.passwordResetTokens.push(tokenObj);
      return tokenObj;
    },
    delete: async ({ where }) => {
      const idx = memoryDb.passwordResetTokens.findIndex(t => t.token === where.token || t.id === where.id);
      if (idx !== -1) return memoryDb.passwordResetTokens.splice(idx, 1)[0];
      return null;
    }
  },

  emailVerificationToken: {
    findUnique: async ({ where }) => {
      return memoryDb.emailVerificationTokens.find(t => t.token === where.token) || null;
    },
    create: async ({ data }) => {
      const tokenObj = {
        id: memoryDb.uuid('evt'),
        userId: data.userId,
        token: data.token,
        expiresAt: new Date(data.expiresAt),
        createdAt: new Date()
      };
      memoryDb.emailVerificationTokens.push(tokenObj);
      return tokenObj;
    },
    delete: async ({ where }) => {
      const idx = memoryDb.emailVerificationTokens.findIndex(t => t.token === where.token);
      if (idx !== -1) return memoryDb.emailVerificationTokens.splice(idx, 1)[0];
      return null;
    }
  },

  // Hydration helpers
  _hydrateUser: (user, include = {}) => {
    if (!user) return null;
    const u = { ...user };
    if (include?.profile) {
      u.profile = memoryDb.profiles.find(p => p.userId === u.id) || null;
    }
    if (include?.offeredSkills) {
      u.offeredSkills = memoryDb.offeredSkills
        .filter(s => s.userId === u.id)
        .map(off => ({
          ...off,
          skill: memoryDb.skills.find(sk => sk.id === off.skillId)
        }));
    }
    if (include?.wantedSkills) {
      u.wantedSkills = memoryDb.wantedSkills
        .filter(s => s.userId === u.id)
        .map(want => ({
          ...want,
          skill: memoryDb.skills.find(sk => sk.id === want.skillId)
        }));
    }
    if (include?.reviewsReceived) {
      u.reviewsReceived = memoryDb.reviews.filter(r => r.revieweeId === u.id);
    }
    return u;
  },

  _hydrateExchange: (ex, include = {}) => {
    if (!ex) return null;
    const item = { ...ex };
    if (include?.sender) {
      item.sender = mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === ex.senderId), { profile: true });
    }
    if (include?.receiver) {
      item.receiver = mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === ex.receiverId), { profile: true });
    }
    if (include?.sessions) {
      item.sessions = memoryDb.sessions.filter(s => s.exchangeId === ex.id);
    }
    if (include?.reviews) {
      item.reviews = memoryDb.reviews.filter(r => r.exchangeId === ex.id);
    }
    item.offeredSkill = memoryDb.skills.find(sk => sk.id === ex.offeredSkillId);
    item.wantedSkill = memoryDb.skills.find(sk => sk.id === ex.wantedSkillId);
    return item;
  },

  _hydrateConversation: (c, include = {}) => {
    if (!c) return null;
    const item = { ...c };
    item.participants = memoryDb.conversationParticipants
      .filter(cp => cp.conversationId === c.id)
      .map(cp => ({
        ...cp,
        user: mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === cp.userId), { profile: true })
      }));
    if (include?.messages) {
      item.messages = memoryDb.messages
        .filter(m => m.conversationId === c.id)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map(m => ({
          ...m,
          sender: mockPrisma._hydrateUser(memoryDb.users.find(u => u.id === m.senderId), { profile: true })
        }));
    }
    return item;
  }
};

// Export active db: prefer real PrismaClient when configured, fallback gracefully
const db = (prismaClient && !useFallback) ? prismaClient : mockPrisma;

module.exports = db;
