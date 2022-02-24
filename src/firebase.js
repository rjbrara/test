// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_KEY,
  authDomain: "apk-croudfunding.firebaseapp.com",
  projectId: "apk-croudfunding",
  storageBucket: "apk-croudfunding.appspot.com",
  messagingSenderId: "419688388243",
  appId: "1:419688388243:web:f55260d6acd1eb2de11f66",
  measurementId: "G-0MWSJESSWH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);