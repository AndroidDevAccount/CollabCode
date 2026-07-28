'use strict';

const jwt = require('jsonwebtoken');
const templateData = require('./templates-data');

const templateOrder = [
  'dotnet-interview-plan',
  'csharp-warmup',
  'csharp-debugging',
  'sql-policy-query',
  'ef-linq',
  'ef-migration',
  'aspnet-mvc',
  'csharp-rest-api',
  'solid-refactor',
  'ai-prompting',
  'frontend-css'
];

const templates = Object.fromEntries(
  templateOrder
    .filter(key => templateData[key])
    .map(key => [key, templateData[key]])
);

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
