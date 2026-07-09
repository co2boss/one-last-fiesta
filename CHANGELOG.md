# Changelog

## v0.3.0
- Added Hacienda courtyard dashboard.
- Added digital boarding pass.
- Added passport stamp toggles.
- Improved onboarding flow and saved profile experience.
- Added official crew roles and teams.

## v0.2.0
- Added Fiesta Passport experience.

## v0.1.0
- Initial project foundation.

## RC2.05 - Firebase Migration

- Automatically migrates existing local passports to Firestore on app startup.
- Prevents duplicate traveler documents by using stable roster-based document IDs.
- Adds clearer cloud sync status messages in the Plaza.
- Keeps local passport fallback if Firestore is unavailable.
