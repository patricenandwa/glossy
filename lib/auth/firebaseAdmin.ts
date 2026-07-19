import admin from "firebase-admin";

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!serviceAccountJson) {
    throw new Error(
        "The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set. Please add it to your .env.local file."
    );
}

if (!admin.apps.length) {
    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const firebaseAdmin = admin;