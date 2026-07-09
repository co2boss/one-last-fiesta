// Project Fiesta — Firestore Module
// RC2.00 — Campfire Foundation

import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import { db } from "./firebase.js";

const travelersRef = collection(db, "travelers");

/**
 * Create a new traveler passport
 */
export async function createTraveler(passport) {
  const docRef = await addDoc(travelersRef, {
    ...passport,
    joinedAt: serverTimestamp(),
    online: true,
    checkedIn: false,
    version: "RC2.00"
  });

  return docRef.id;
}

/**
 * Listen for live traveler updates
 */
export function subscribeToTravelers(callback) {
  const q = query(travelersRef, orderBy("joinedAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const travelers = [];

    snapshot.forEach((docSnap) => {
      travelers.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    callback(travelers);
  });
}

/**
 * Update traveler status
 */
export async function updateTraveler(id, updates) {
  const travelerDoc = doc(db, "travelers", id);

  await updateDoc(travelerDoc, updates);
}
