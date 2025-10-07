# Firebase Debug Guide

## Current Configuration
- Project ID: f1project-736d3
- App ID: 1:457112905568:web:0334565213ab64aefce005
- API Key: AIzaSyBXF5HHj6SB_YYJkGXjyaB3nEVpGHw6Yl8

## Steps to Fix Google Login

### 1. Check Firebase Console Settings
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `f1project-736d3`
3. Go to **Authentication** → **Sign-in method**
4. Make sure **Google** is enabled
5. Add `localhost` to authorized domains if not already there

### 2. Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Try Google login
4. Look for any error messages

### 3. Common Issues
- **Popup blocked**: Check if browser is blocking popups
- **Domain not authorized**: Add localhost to Firebase authorized domains
- **Google Auth not enabled**: Enable Google sign-in in Firebase Console
- **Wrong configuration**: Verify all Firebase config values match

### 4. Test Steps
1. Restart the dev server: `npm run dev`
2. Clear browser cache/cookies
3. Try Google login again
4. Check console for specific error messages

## If Still Not Working
Please share the exact error message from the browser console so I can help further.
