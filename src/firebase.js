import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGhwxzsKQGyPzFrl0rPILASxgps57qdG0",
  authDomain: "voteindia-cc4a5.firebaseapp.com",
  projectId: "voteindia-cc4a5",
  storageBucket: "voteindia-cc4a5.firebasestorage.app",
  messagingSenderId: "573036024911",
  appId: "1:573036024911:web:7abba0282178224f76463a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);