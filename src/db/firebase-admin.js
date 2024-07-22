// src/db/firebase-admin.js
import admin from 'firebase-admin';
import serviceAccount from './wasa-19ede-firebase-adminsdk-tvgeh-beb2c7771f.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'wasa-19ede.appspot.com' // Asegúrate de que esta es la configuración correcta
});

const bucket = admin.storage().bucket();

export default bucket;
