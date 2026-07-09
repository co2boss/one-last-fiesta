// Project Fiesta — Traveler Identity Module
// RC2.04 — Local traveler identity for Firestore sync

const DEVICE_ID_KEY = "projectFiesta.deviceTravelerId";

function createDeviceId() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `traveler-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Gives each phone/browser a stable traveler ID.
 * This avoids passwords and avoids requiring Firebase Auth setup.
 */
export async function initializeTravelerAuth() {
  let uid = localStorage.getItem(DEVICE_ID_KEY);

  if (!uid) {
    uid = createDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, uid);
  }

  console.log("Traveler device identity ready:", uid);

  return {
    uid,
    isAnonymous: true,
    provider: "local-device"
  };
}

export function getCurrentTravelerId() {
  return localStorage.getItem(DEVICE_ID_KEY);
}
