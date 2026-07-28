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
  '/api/auth/login': './api/auth/login',
  '/api/auth/verify': './api/auth/verify',
  '/api/auth/logout': './api/auth/logout',
  '/api/auth/reset-password': './api/auth/reset-password',
  '/api/auth/update-password': './api/auth/update-password',
  '/api/sessions/create': './api/sessions/create',
  '/api/firebase-config.js': './api/firebase-config',
  '/api/code/execute': './api/code/execute',
  '/api/activity/save': './api/activity/save',
  '/api/slack/send': './api/slack/send',
  '/api/check-duplicate-login': './api/check-duplicate-login',
  '/api/track-session': './api/track-session'
};

for (const [route, modulePath] of Object.entries(routes)) {
  app.all(route, (req, res, next) => {
    try {
      return require(modulePath)(req, res);
    } catch (error) {
      return next(error);
    }
  });
}

app.get('/healthz', (_req, res) => {
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname), {
  index: 'index.html',
  dotfiles: 'deny'
}));

app.listen(port, '0.0.0.0', () => {
  console.log(`OpenCollab listening on port ${port}`);
});
