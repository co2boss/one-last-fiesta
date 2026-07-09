// Project Fiesta — Firebase Connection
// RC2.00 — Campfire Foundation

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBgaCetyeuyZ1EgrSgC10_CjyfyKzpYiQg",
  authDomain: "ultima-fiesta.firebaseapp.com",
  projectId: "ultima-fiesta",
  storageBucket: "ultima-fiesta.firebasestorage.app",
  messagingSenderId: "616647899283",
  appId: "1:616647899283:web:e876688a22e3380c813566",
  measurementId: "G-8F90XMV9LD"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

try {
  getAnalytics(app);
} catch (error) {
  console.warn("Analytics unavailable:", error);
}

export async function signInTraveler() {
  const result = await signInAnonymously(auth);
  return result.user;
}
