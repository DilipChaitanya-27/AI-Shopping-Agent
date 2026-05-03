import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAyVU8Q1jGhSiaTyZ5sasax7GfpHzrl7lQ",
  authDomain: "ai-shopping-agent-63c59.firebaseapp.com",
  projectId: "ai-shopping-agent-63c59",
  storageBucket: "ai-shopping-agent-63c59.firebasestorage.app",
  messagingSenderId: "210261035494",
  appId: "1:210261035494:web:b2765e77c1d3ee0dedae27",
  measurementId: "G-KS5SZ1GQPL",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

