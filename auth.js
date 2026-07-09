// Project Fiesta — Auth Module
// RC2.00 — Campfire Foundation

import { auth, signInTraveler } from "./firebase.js";

/**
 * Signs the traveler in anonymously.
 * No password. No account creation. No friction.
 */
export async function initializeTravelerAuth() {
  try {
    const user = auth.currentUser || await signInTraveler();

    console.log("Traveler signed in:", user.uid);

    return {
      uid: user.uid,
      isAnonymous: user.isAnonymous
    };
  } catch (error) {
    console.error("Firebase anonymous sign-in failed:", error);
    throw error;
  }
}

/**
 * Returns current traveler ID if already signed in.
 */
export function getCurrentTravelerId() {
  return auth.currentUser ? auth.currentUser.uid : null;
}
