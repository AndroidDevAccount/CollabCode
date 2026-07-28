'use strict';

const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const templateData = require('./templates-data');

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

const questionSets = {
  'complete-dotnet': {
    title: 'Complete .NET Interview',
    description: 'The full interview, including the candidate overview.',
    questions: templateOrder
  }
};

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');

  if (!['GET', 'POST'].includes(req.method)) {
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

    if (!admin.apps.length) {
      return res.status(503).json({ error: 'Question-set storage is unavailable' });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const name = String(body?.name || '').trim();
      const description = String(body?.description || '').trim();
      const questions = body?.questions;
      const importedId = typeof body?.id === 'string' ? body.id.trim() : '';

      if (!name || name.length > 120) {
        return res.status(400).json({ error: 'Question set name is required (120 characters maximum)' });
      }
      if (!Array.isArray(questions) || questions.length < 1 || questions.length > 50) {
        return res.status(400).json({ error: 'Provide between 1 and 50 questions' });
      }

      const allowedLanguages = new Set([
        'javascript', 'python', 'java', 'c_cpp', 'csharp', 'php', 'ruby',
        'go', 'rust', 'typescript', 'swift', 'kotlin', 'scala', 'r', 'perl',
        'lua', 'haskell', 'elixir', 'dart', 'html', 'css', 'sql', 'json',
        'yaml', 'xml', 'markdown'
      ]);
      const normalizedQuestions = questions.map((question, index) => {
        const title = String(question?.title || '').trim();
        const language = String(question?.language || '').trim();
        const content = String(question?.content || '');
        const answerKey = String(question?.answerKey || '');
        if (!title || !allowedLanguages.has(language) || !content.trim() || !answerKey.trim()) {
          throw Object.assign(new Error(`Question ${index + 1} is missing a valid title, language, content, or answer key`), { status: 400 });
        }
        if (title.length > 120 || content.length > 50000 || answerKey.length > 50000) {
          throw Object.assign(new Error(`Question ${index + 1} exceeds the allowed size`), { status: 400 });
        }
        return { title, language, content, answerKey };
      });

      const validImportedId = /^[A-Za-z0-9_-]{1,80}$/.test(importedId);
      const setId = validImportedId
        ? (importedId.startsWith('custom-') ? importedId : `custom-${importedId}`)
        : `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const storedSet = {
        name,
        description: description.slice(0, 300),
        questions: normalizedQuestions,
        createdAt: Date.now(),
        createdBy: decoded.email
      };
      await admin.database().ref().update({
        [`customQuestionSets/${setId}`]: storedSet,
        [`customQuestionSetMetadata/${setId}`]: {
          name: storedSet.name,
          description: storedSet.description,
          questionCount: normalizedQuestions.length,
          createdAt: storedSet.createdAt,
          createdBy: storedSet.createdBy
        }
      });
      return res.status(201).json({ success: true, setId });
    }

    const metadataRef = admin.database().ref('customQuestionSetMetadata');
    let metadataSnapshot = await metadataRef.once('value');
    let customSetMetadata = metadataSnapshot.val() || {};

    // Backfill metadata for sets saved before the lightweight index existed.
    if (!metadataSnapshot.exists()) {
      const legacySnapshot = await admin.database().ref('customQuestionSets').once('value');
      const legacySets = legacySnapshot.val() || {};
      customSetMetadata = Object.fromEntries(
        Object.entries(legacySets).map(([setId, set]) => [setId, {
          name: set.name,
          description: set.description || '',
          questionCount: Object.keys(set.questions || {}).length,
          createdAt: set.createdAt,
          createdBy: set.createdBy
        }])
      );
      if (Object.keys(customSetMetadata).length) {
        await metadataRef.set(customSetMetadata);
      }
    }

    const responseTemplates = { ...templates };
    const responseQuestionSets = { ...questionSets };
    const requestedSetId = String(req.query?.setId || '');

    Object.entries(customSetMetadata).forEach(([setId, set]) => {
      const questionKeys = Array.from(
        { length: Number(set.questionCount) || 0 },
        (_, index) => `${setId}:${index}`
      );
      responseQuestionSets[setId] = {
        title: set.name,
        description: set.description || '',
        questions: questionKeys,
        custom: true
      };
    });

    if (requestedSetId && responseQuestionSets[requestedSetId]?.custom) {
      const selectedSnapshot = await admin.database()
        .ref(`customQuestionSets/${requestedSetId}`)
        .once('value');
      const selectedSet = selectedSnapshot.val();
      Object.values(selectedSet?.questions || {}).forEach((question, index) => {
        responseTemplates[`${requestedSetId}:${index}`] = question;
      });
    }

    return res.status(200).json({
      templates: responseTemplates,
      questionSets: responseQuestionSets
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    if (error.status) return res.status(error.status).json({ error: error.message });
    if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name)) {
      return res.status(401).json({ error: 'Invalid or expired authentication' });
    }
    console.error('Interview template error:', error);
    return res.status(500).json({ error: 'Interview templates are unavailable' });
  }
};
