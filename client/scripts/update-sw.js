const fs = require('fs');
const path = require('path');
require('dotenv').config();

const swPath = path.join(__dirname, '../public/firebase-messaging-sw.js');

// Read the service worker file
let swContent = fs.readFileSync(swPath, 'utf8');

// Replace the placeholder values with actual environment variables
swContent = swContent.replace('YOUR_API_KEY', process.env.VITE_FIREBASE_API_KEY);
swContent = swContent.replace('YOUR_AUTH_DOMAIN', process.env.VITE_FIREBASE_AUTH_DOMAIN);
swContent = swContent.replace('YOUR_PROJECT_ID', process.env.VITE_FIREBASE_PROJECT_ID);
swContent = swContent.replace('YOUR_STORAGE_BUCKET', process.env.VITE_FIREBASE_STORAGE_BUCKET);
swContent = swContent.replace('YOUR_MESSAGING_SENDER_ID', process.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
swContent = swContent.replace('YOUR_APP_ID', process.env.VITE_FIREBASE_APP_ID);
swContent = swContent.replace('YOUR_MEASUREMENT_ID', process.env.VITE_FIREBASE_MEASUREMENT_ID);

// Write the updated content back to the file
fs.writeFileSync(swPath, swContent); 