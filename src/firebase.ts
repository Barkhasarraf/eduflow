import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// REPLACE WITH YOUR FIREBASE CONFIG
const env = (import.meta as any).env || {};

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEJ8FW_QuGHw9EklPCy6Rqlhiqc0AiyAA",
  authDomain: "school-management-system-94fb0.firebaseapp.com",
  projectId: "school-management-system-94fb0",
  storageBucket: "school-management-system-94fb0.firebasestorage.app",
  messagingSenderId: "1026067976539",
  appId: "1:1026067976539:web:aed78e56d7c6f5ed2dca7e",
  measurementId: "G-0K5MQHVQRY"
};

// Check if configuration is replaced or using environment vars
export const isFirebaseConfigured = () => {
  return (
    firebaseConfig.apiKey !== "YOUR_API_KEY_HERE" &&
    firebaseConfig.databaseURL !== "YOUR_DATABASE_URL_HERE" &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID_HERE"
  );
};

let app;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
  } catch (error) {
    console.error("Firebase failed to initialize:", error);
  }
}

export { auth, db };
