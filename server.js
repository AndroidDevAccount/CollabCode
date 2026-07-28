require('dotenv').config();

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const routes = {
  '/api/auth/login': () => require('./api/auth/login'),
  '/api/auth/verify': () => require('./api/auth/verify'),
  '/api/auth/logout': () => require('./api/auth/logout'),
  '/api/auth/reset-password': () => require('./api/auth/reset-password'),
  '/api/auth/update-password': () => require('./api/auth/update-password'),
  '/api/sessions/create': () => require('./api/sessions/create'),
  '/api/firebase-config.js': () => require('./api/firebase-config'),
  '/api/code/execute': () => require('./api/code/execute'),
  '/api/activity/save': () => require('./api/activity/save'),
  '/api/slack/send': () => require('./api/slack/send'),
  '/api/check-duplicate-login': () => require('./api/check-duplicate-login'),
  '/api/track-session': () => require('./api/track-session')
};

for (const [route, getHandler] of Object.entries(routes)) {
  app.all(route, (req, res, next) => {
    try {
      return getHandler()(req, res);
    } catch (error) {
      return next(error);
    }
  });
}

app.get('/healthz', (_req, res) => {
  res.json({ ok: true });
});

const staticRoot = process.env.VERCEL
  ? path.join(__dirname, 'public')
  : __dirname;

app.use(express.static(staticRoot, {
  index: 'index.html',
  dotfiles: 'deny'
}));

app.listen(port, '0.0.0.0', () => {
  console.log(`OpenCollab listening on port ${port}`);
});
