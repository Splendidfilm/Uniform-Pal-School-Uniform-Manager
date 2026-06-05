import admin from 'firebase-admin'

if(!admin.apps.length) {
    try{
        admin.initializeApp({
            credential: admin.credential.cert(
                JSON.parse(process.env.FIREBASE_SERVCE_ACCOUNT as string)
            ),
        });
    }catch(error){
        console.error("Firebase abmin initilaization error", error);
    }
}

export const db = admin.firestore()