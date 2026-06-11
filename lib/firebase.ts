// lib/firebase.ts
import admin from "firebase-admin";

// Use a global variable to persist the connection across Next.js hot-reloads
const globalWithFirebase = global as typeof globalThis & {
  firebaseAdminApp?: admin.app.App;
};

function getFirebaseAdmin() {
  if (globalWithFirebase.firebaseAdminApp) {
    return globalWithFirebase.firebaseAdminApp;
  }

  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (!serviceAccountString) {
      // During Next.js build steps, if the key is missing, warn but don't hard crash
      console.warn("⚠️ Warning: FIREBASE_SERVICE_ACCOUNT is undefined in this build environment context.");
      return null;
    }

    const serviceAccount = JSON.parse(serviceAccountString);

    globalWithFirebase.firebaseAdminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("🔥 Firebase Admin successfully initialized!");
    return globalWithFirebase.firebaseAdminApp;
  } catch (error) {
    console.error("❌ Firebase admin initialization error:", error);
    return null;
  }
}

// Export a function to get the DB dynamically instead of a static variable instance
export const getDb = () => {
  const app = getFirebaseAdmin();
  if (!app) {
    // If it's missing during build, return a mock/dummy object so top-level imports don't crash
    return {
      collection: () => ({
        get: async () => ({ docs: [] }),
        doc: () => ({ get: async () => ({ exists: false }), delete: async () => {} }),
      }),
    } as unknown as admin.firestore.Firestore;
  }
  return admin.firestore();
};