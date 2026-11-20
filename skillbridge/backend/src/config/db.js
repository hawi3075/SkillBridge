/**
 * Database Client Configuration
 * SkillBridge PostgreSQL via Prisma ORM (Neon Cloud Database)
 *
 * Neon free-tier computes auto-suspend after ~5 min of inactivity.
 * The first query after a cold-start can fail while the compute wakes.
 * We work around this with an exponential-backoff connection helper and
 * a Prisma middleware that retries transient "can't reach server" errors.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  datasources: {
    db: { url: process.env.DATABASE_URL }
  }
});

// ── Middleware: retry on Neon cold-start errors ──────────────────────────────
const RETRYABLE = ["Can't reach database server", 'Connection refused', 'ECONNREFUSED', 'connection timeout'];

prisma.$use(async (params, next) => {
  const MAX_RETRIES = 4;
  let attempt = 0;

  while (true) {
    try {
      return await next(params);
    } catch (err) {
      const isRetryable = RETRYABLE.some(msg => err.message?.includes(msg));
      if (!isRetryable || attempt >= MAX_RETRIES) throw err;

      attempt++;
      const delay = 300 * Math.pow(2, attempt); // 600 ms, 1.2 s, 2.4 s, 4.8 s
      console.warn(`⚠️  DB connection lost (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${delay}ms…`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
});

// ── Boot-time connection check (non-fatal) ───────────────────────────────────
(async () => {
  for (let i = 1; i <= 3; i++) {
    try {
      await prisma.$connect();
      console.log('✅ Connected to Neon PostgreSQL via Prisma');
      return;
    } catch (err) {
      const retryable = RETRYABLE.some(m => err.message?.includes(m));
      if (!retryable || i === 3) {
        console.error('❌ Database connection error:', err.message);
        return;
      }
      const delay = 1000 * i;
      console.warn(`⚠️  Neon compute waking up… retrying boot check in ${delay}ms (${i}/3)`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
})();

// ── Graceful shutdown ────────────────────────────────────────────────────────
process.on('beforeExit', async () => { await prisma.$disconnect(); });

module.exports = prisma;
