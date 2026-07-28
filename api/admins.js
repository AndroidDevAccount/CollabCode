'use strict';

const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

if (!admin.apps.length && process.env.FIREBASE_PROJECT_ID) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

function emailKey(email) {
  return Buffer.from(email.trim().toLowerCase()).toString('base64url');
}

function requireAdmin(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ') || !process.env.JWT_SECRET) {
    throw Object.assign(new Error('Authentication required'), { status: 401 });
  }
  const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
  if (decoded.isAdmin !== true) {
    throw Object.assign(new Error('Admin access required'), { status: 403 });
  }
  return decoded;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const currentAdmin = requireAdmin(req);
    if (!admin.apps.length) {
      return res.status(503).json({ error: 'Admin storage is not configured' });
    }
    const adminsRef = admin.database().ref('adminAccounts');
    const ownerEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();

    if (req.method === 'GET') {
      const snapshot = await adminsRef.once('value');
      const additionalAdmins = Object.values(snapshot.val() || {}).map(account => ({
        email: account.email,
        createdAt: account.createdAt,
        createdBy: account.createdBy,
        disabled: account.disabled === true,
        owner: false
      }));
      const owner = ownerEmail
        ? [{ email: ownerEmail, owner: true }]
        : [];
      return res.status(200).json({ admins: [...owner, ...additionalAdmins] });
    }

    if (!ownerEmail || String(currentAdmin.email || '').trim().toLowerCase() !== ownerEmail) {
      return res.status(403).json({ error: 'Only the configured owner can create admins' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Enter a valid email address' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (email === ownerEmail) {
      return res.status(409).json({ error: 'That admin already exists' });
    }

    const accountRef = adminsRef.child(emailKey(email));
    const account = {
      email,
      passwordHash: await bcrypt.hash(password, 12),
      createdAt: Date.now(),
      createdBy: currentAdmin.email,
      disabled: false
    };
    const result = await accountRef.transaction(currentValue => {
      if (currentValue !== null) return;
      return account;
    });
    if (!result.committed) {
      return res.status(409).json({ error: 'That admin already exists' });
    }

    return res.status(201).json({ success: true, admin: { email, owner: false } });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    const authError = ['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError']
      .includes(error.name);
    const status = error.status || (authError ? 401 : 500);
    if (status === 500) console.error('Admin management error:', error);
    return res.status(status).json({
      error: status === 500 ? 'Admin management failed' : error.message
    });
  }
};
