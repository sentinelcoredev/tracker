import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5Qqy4SoefGJUfgQj3YEUVeXct9jksqhM",
  authDomain: "investment-calculator-e8fa7.firebaseapp.com",
  projectId: "investment-calculator-e8fa7",
  storageBucket: "investment-calculator-e8fa7.firebasestorage.app",
  messagingSenderId: "72614654617",
  appId: "1:72614654617:web:c639e42480d0ea53bcfe08",
  measurementId: "G-3J3VSNTKMD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
console.log("Firebase initialized successfully.");