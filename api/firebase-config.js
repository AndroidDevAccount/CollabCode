module.exports = function firebaseConfig(req, res) {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  };

  if (Object.values(config).some(value => !value)) {
    return res
      .status(503)
      .type('application/javascript')
      .send('console.error("Firebase web configuration is incomplete.");');
  }

  res
    .status(200)
    .set('Cache-Control', 'public, max-age=300')
    .type('application/javascript')
    .send(`
      var config = ${JSON.stringify(config)};
      firebase.initializeApp(config);
      firebase.database().ref('.info/connected').on('value', function(snapshot) {
        if (snapshot.val() === true) {
          console.log('Firebase connected');
        } else {
          console.warn('Firebase disconnected');
        }
      });
    `);
};
