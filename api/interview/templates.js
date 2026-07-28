'use strict';

const jwt = require('jsonwebtoken');
const templates = require('./templates-data');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('Missing required environment variable: JWT_SECRET');
    return res.status(503).json({ error: 'Interview templates are unavailable' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(authHeader.substring(7), jwtSecret);
    if (decoded.isAdmin !== true) {
      return res.status(403).json({ error: 'Interviewer access required' });
    }

    return res.status(200).json({ templates });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired authentication' });
  }
};
