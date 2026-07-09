// Project Fiesta — Firestore Module
// RC2.04 — Cloud Passport Save + Live Plaza

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import { db } from "./firebase.js";

const travelersRef = collection(db, "travelers");

export async function saveTravelerPassport(travelerId, passport) {
  if (!travelerId) throw new Error("Missing travelerId for passport save.");

  const travelerDoc = doc(db, "travelers", travelerId);

  await setDoc(
    travelerDoc,
    {
      ...passport,
      travelerId,
      online: true,
      checkedIn: false,
      updatedAt: serverTimestamp(),
      joinedAt: passport.joinedAt || serverTimestamp(),
      cloudVersion: "RC2.04"
    },
    { merge: true }
  );

  return travelerId;
}

export function subscribeToTravelers(callback) {
  const q = query(travelersRef, orderBy("joinedAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const travelers = [];

    snapshot.forEach((docSnap) => {
      if (docSnap.id === "setup") return;
      travelers.push({ id: docSnap.id, ...docSnap.data() });
    });

    callback(travelers);
  });
}

export async function updateTraveler(id, updates) {
  const travelerDoc = doc(db, "travelers", id);
  await updateDoc(travelerDoc, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}
