/**
 * JWT Token Generation and Verification
 * Uses jsonwebtoken with a built-in crypto HMAC fallback.
 */

const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'skillbridge_super_secret_jwt_key_2026_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

let jwtLib = null;
try {
  jwtLib = require('jsonwebtoken');
} catch (e) {
  // Built-in crypto fallback
}

// Fallback manual JWT implementation using Node's crypto
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64').toString('utf8');
}

function fallbackSign(payload, secret, options = {}) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const expSeconds = 7 * 24 * 60 * 60; // 7 days default
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expSeconds
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac('sha256', secret).update(data).digest('base64');
  const encodedSignature = signature.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${data}.${encodedSignature}`;
}

function fallbackVerify(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token structure');
  const [header, payload, signature] = parts;
  const data = `${header}.${payload}`;
  const expectedSig = crypto.createHmac('sha256', secret).update(data).digest('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  if (signature !== expectedSig) {
    throw new Error('Invalid signature');
  }

  const decoded = JSON.parse(base64UrlDecode(payload));
  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return decoded;
}

const generateToken = (payload) => {
  if (jwtLib) {
    return jwtLib.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
  return fallbackSign(payload, JWT_SECRET);
};

const verifyToken = (token) => {
  if (jwtLib) {
    return jwtLib.verify(token, JWT_SECRET);
  }
  return fallbackVerify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
