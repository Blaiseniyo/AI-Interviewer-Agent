// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5su8gwf53jyQM7jDM3IgwVaV9vwilYwI",
  authDomain: "ai-interview-agent-48b67.firebaseapp.com",
  projectId: "ai-interview-agent-48b67",
  storageBucket: "ai-interview-agent-48b67.firebasestorage.app",
  messagingSenderId: "873588683156",
  appId: "1:873588683156:web:3c4709946a3e6062e1df81",
  measurementId: "G-RX4DBT8CC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);