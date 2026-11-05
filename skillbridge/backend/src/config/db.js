/**
 * Database Client Configuration
 * SkillBridge PostgreSQL Client via Prisma ORM (Neon Cloud Database)
 *
 * All application queries are executed directly against PostgreSQL.
 * Mock data and in-memory stores have been completely removed.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

// Verify connection on boot
prisma.$connect()
  .then(() => {
    console.log('✅ Successfully connected to Neon PostgreSQL database via Prisma');
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
  });

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
