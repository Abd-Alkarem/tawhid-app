import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// TODO: Replace with your Firebase project credentials
// Get these from: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "AIzaSyAuPaHjm6e1gvIEdtxRZyPmPkQUdNqgr08",
  authDomain: "tawhid-app-8fe3f.firebaseapp.com",
  projectId: "tawhid-app-8fe3f",
  storageBucket: "tawhid-app-8fe3f.firebasestorage.app",
  messagingSenderId: "644909839525",
  appId: "1:644909839525:web:45e459f061d7350e91894c",
  measurementId: "G-JE13EXRX01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
