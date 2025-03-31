import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAqUntHr6kUWdt-_kL0vnJ9lLpwloa5TRY",
  authDomain: "f1project-736d3.firebaseapp.com",
  projectId: "f1project-736d3",
  storageBucket: "f1project-736d3.firebasestorage.app",
  messagingSenderId: "457112905568",
  appId: "1:457112905568:web:0334565213ab64aefce005",
  measurementId: "G-M6SDJP78CZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 