import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC5Vod4MRzdnJjSbSeQdRv5-ZytfgSONLk",
  authDomain: "resolute-ai-assignment-7a35e.firebaseapp.com",
  databaseURL: "https://resolute-ai-assignment-7a35e-default-rtdb.firebaseio.com",
  projectId: "resolute-ai-assignment-7a35e",
  storageBucket: "resolute-ai-assignment-7a35e.appspot.com",
  messagingSenderId: "644810785249",
  appId: "1:644810785249:web:8f71bacfc38f4df4da92a0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();