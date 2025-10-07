// Local development configuration
// This file contains the configuration for running the app locally

export const localConfig = {
  // API Base URL for local development
  // Make sure your C# server is running on this port
  API_BASE_URL: 'https://localhost:7271/api',
  
  // Firebase configuration
  // Using your actual Firebase project values
  FIREBASE: {
    apiKey: "AIzaSyAqUntHr6kUWdt-_kL0vnJ9lLpwloa5TRY",
    authDomain: "f1project-736d3.firebaseapp.com", 
    projectId: "f1project-736d3",
    storageBucket: "f1project-736d3.firebasestorage.app",
    messagingSenderId: "457112905568",
    appId: "1:457112905568:web:0334565213ab64aefce005",
    measurementId: "G-M6SDJP78CZ"
  }
};

// Export the API base URL for use in components
export const API_BASE_URL = localConfig.API_BASE_URL;
