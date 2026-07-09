# RC2.10 First Contact Test

After uploading this release:

1. Open the live Netlify app with `?v=210` at the end of the URL.
2. Complete or reset/recreate a passport.
3. Go to Firebase Console → Firestore Database → travelers.
4. Confirm a document appears with a stable ID like `daniel`, `cesar`, `kevin`, etc.
5. Open the app on another phone and refresh. The Plaza should show the joined traveler.

If it still does not write, check the app Plaza Status card. It should display the Firebase error message.
