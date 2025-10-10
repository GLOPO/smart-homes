// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "smart-homes-761df.firebaseapp.com",
  projectId: "smart-homes-761df",
  storageBucket: "smart-homes-761df.firebasestorage.app",
  messagingSenderId: "542796616687",
  appId: "1:542796616687:web:d54557821f6fb9a0eb5c1a",
  measurementId: "G-48RXN0JC3X"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);