import admin from 'firebase-admin';

interface FirebaseEnv {
    FIREBASE_PROJECT_ID: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;
}

const env: FirebaseEnv = {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? '',
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ?? '',
    FIREBASE_PRIVATE_KEY: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n')
};

if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    throw new Error('Faltan variables de entorno de Firebase');
}

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: env.FIREBASE_PROJECT_ID,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: env.FIREBASE_PRIVATE_KEY
        })
    });
    console.log('Firebase Admin inicializado con variables de entorno');
}

export { admin };
