// Project Fiesta — Auth Module
// RC2.02 — Anonymous Traveler Authentication

import { auth, signInTraveler } from "./firebase.js";

export async function initializeTravelerAuth() {
  try {
    const user = auth.currentUser || await signInTraveler();
    console.log("Traveler signed in:", user.uid);
    return { uid: user.uid, isAnonymous: user.isAnonymous };
  } catch (error) {
    console.error("Firebase anonymous sign-in failed:", error);
    throw error;
  }
}

export function getCurrentTravelerId() {
  return auth.currentUser ? auth.currentUser.uid : null;
}
