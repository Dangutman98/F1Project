// Configuration service for the application
import { localConfig } from './local';

// Check if we're in development mode (local)
const isDevelopment = import.meta.env.DEV;

// Use local config for development, environment variables for production
export const config = {
  API_BASE_URL: isDevelopment 
    ? localConfig.API_BASE_URL 
    : import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    
  FIREBASE: isDevelopment 
    ? localConfig.FIREBASE 
    : {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
      }
};

// Export the API base URL for easy access
export const API_BASE_URL = config.API_BASE_URL;
