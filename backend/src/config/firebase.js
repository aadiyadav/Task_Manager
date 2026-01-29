const admin = require('firebase-admin')
const dotenv = require('dotenv')

dotenv.config()

let app
let firestore

function getFirebaseApp() {
  if (app) return app

  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
  } = process.env

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error('Missing Firebase environment variables')
  }

  const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  })

  return app
}

function getAuth() {
  return getFirebaseApp().auth()
}

function getFirestore() {
  if (firestore) return firestore
  firestore = getFirebaseApp().firestore()
  return firestore
}

module.exports = {
  getFirebaseApp,
  getAuth,
  getFirestore,
}

