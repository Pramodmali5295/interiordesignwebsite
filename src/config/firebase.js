import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0piCdctfnpgaWiLuXl-OfZg45DI0JE2k",
  authDomain: "interiordesignwebsite-66c53.firebaseapp.com",
  projectId: "interiordesignwebsite-66c53",
  storageBucket: "interiordesignwebsite-66c53.firebasestorage.app",
  messagingSenderId: "544658106202",
  appId: "1:544658106202:web:3a84d7aa5528d7efc83563",
  measurementId: "G-KJFCQLSCE7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Safe Analytics init (for non-browser compile environments support)
let analytics = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    console.warn("Firebase Analytics could not be initialized:", err);
  }
}

export { app, db, analytics };
