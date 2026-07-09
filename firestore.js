// Project Fiesta — Firestore Module
// RC2.05 — Passport Migration + Duplicate Prevention

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

const ROSTER_IDS = new Map([
  ["cesar", "cesar"],
  ["daniel", "daniel"],
  ["kevin", "kevin"],
  ["gerardo", "gerardo"],
  ["david", "david"],
  ["chucky", "chucky"],
  ["jose", "jose"],
  ["arturo", "arturo"],
  ["frank", "frank"]
]);

function normalizeName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function travelerDocumentId(passport, fallbackId = "") {
  const normalized = normalizeName(passport?.name || passport?.firstName || "");

  if (ROSTER_IDS.has(normalized)) {
    return ROSTER_IDS.get(normalized);
  }

  return normalized || fallbackId || `traveler-${Date.now()}`;
}

/**
 * Create or update a traveler passport in Firestore.
 * Important: this uses a stable document ID based on the traveler's first name
 * so Kevin submitting twice updates /travelers/kevin instead of creating duplicates.
 */
export async function saveTravelerPassport(travelerId, passport) {
  const documentId = travelerDocumentId(passport, travelerId);
  if (!documentId) throw new Error("Missing traveler document ID for passport save.");

  const travelerDoc = doc(db, "travelers", documentId);

  await setDoc(
    travelerDoc,
    {
      ...passport,
      id: documentId,
      travelerId: documentId,
      deviceTravelerId: travelerId || null,
      online: true,
      checkedIn: false,
      updatedAt: serverTimestamp(),
      // Keep joinedAt available for ordering. If this document already exists,
      // merge keeps earlier fields unless overwritten by the passport data.
      joinedAt: passport.joinedAt || serverTimestamp(),
      cloudVersion: "RC2.05"
    },
    { merge: true }
  );

  return documentId;
}

export function subscribeToTravelers(callback, errorCallback = console.error) {
  const q = query(travelersRef, orderBy("joinedAt", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const travelers = [];

      snapshot.forEach((docSnap) => {
        if (docSnap.id === "setup") return;
        travelers.push({ id: docSnap.id, ...docSnap.data() });
      });

      callback(travelers);
    },
    errorCallback
  );
}

export async function updateTraveler(id, updates) {
  const travelerDoc = doc(db, "travelers", id);
  await updateDoc(travelerDoc, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}
