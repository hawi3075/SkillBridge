/**
 * Password Hashing & Verification Helper
 * Uses bcryptjs if available with PBKDF2 crypto fallback.
 */

const crypto = require('crypto');

let bcrypt = null;
try {
  bcrypt = require('bcryptjs');
} catch (e) {
  try {
    bcrypt = require('bcrypt');
  } catch (err) {
    // PBKDF2 fallback
  }
}

const hashPassword = async (plainPassword) => {
  if (bcrypt) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainPassword, salt);
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512').toString('hex');
  return `pbkdf2:${salt}:${hash}`;
};

const comparePassword = async (plainPassword, hashedPassword) => {
  if (!hashedPassword) return false;

  if (hashedPassword.startsWith('pbkdf2:')) {
    const parts = hashedPassword.split(':');
    const salt = parts[1];
    const originalHash = parts[2];
    const testHash = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512').toString('hex');
    return originalHash === testHash;
  }

  if (bcrypt) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // If plain comparison for initial mock seeds or fallback
  return plainPassword === hashedPassword;
};

module.exports = {
  hashPassword,
  comparePassword
};
