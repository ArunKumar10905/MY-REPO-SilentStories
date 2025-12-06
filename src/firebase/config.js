// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmo1Cmf0yDYeawdEUNoc7NdHPW6EZ5dsY",
  authDomain: "story-73855.firebaseapp.com",
  projectId: "story-73855",
  storageBucket: "story-73855.firebasestorage.app",
  messagingSenderId: "451328491428",
  appId: "1:451328491428:web:34d7671f6829837a800b31",
  measurementId: "G-LMYRB2FSB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
export default firebaseConfig;