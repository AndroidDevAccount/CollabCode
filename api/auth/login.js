/**
 * Vercel Serverless Function - Login Endpoint
 * /api/auth/login
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

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

// Admin credentials (use environment variables in production)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

// Ensure required environment variables are set
if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
  console.error('Missing required environment variables: ADMIN_EMAIL, ADMIN_PASSWORD_HASH, or JWT_SECRET');
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body if it's a string (Vercel sometimes doesn't parse JSON automatically)
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }
  }

  const { email, password } = body || {};

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password required',
      debug: process.env.NODE_ENV !== 'production' ? {
        bodyType: typeof req.body,
        hasBody: !!req.body,
        hasEmail: !!email,
        hasPassword: !!password
      } : undefined
    });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedOwnerEmail = ADMIN_EMAIL
      ? String(ADMIN_EMAIL).trim().toLowerCase()
      : '';
    const ownerLogin = Boolean(normalizedOwnerEmail) &&
      normalizedEmail === normalizedOwnerEmail;
    let passwordHash = ownerLogin ? ADMIN_PASSWORD_HASH : null;

    if (!ownerLogin && admin.apps.length) {
      const snapshot = await admin.database()
        .ref(`adminAccounts/${emailKey(normalizedEmail)}`)
        .once('value');
      const account = snapshot.val();
      if (account && account.disabled !== true) passwordHash = account.passwordHash;
    }

    const validPassword = passwordHash
      ? await bcrypt.compare(password, passwordHash)
      : false;
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      {
        email: normalizedEmail,
        isAdmin: true,
        userId: 'admin-' + Date.now()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token: token,
      user: { email: normalizedEmail, isAdmin: true }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
