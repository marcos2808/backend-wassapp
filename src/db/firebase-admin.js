// src/db/firebase-admin.js
import admin from 'firebase-admin';
import config from './config.js';

admin.initializeApp({
  credential: admin.credential.cert(config),
  storageBucket: 'wasa-19ede.appspot.com' // Asegúrate de que esta es la configuración correcta
});

const bucket = admin.storage().bucket();

export default bucket;
