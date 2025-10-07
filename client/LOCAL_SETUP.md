# Local Development Setup Guide

## Prerequisites
- Your C# server is running on `https://localhost:7271` (or update the URL in `src/config/local.ts`)
- Node.js and npm installed

## Setup Steps

### 1. Firebase Configuration (Already Set)
The Firebase configuration has been automatically set up with your project values:
- Project ID: f1project-736d3
- API Key: AIzaSyBXF5HHj6SB_YYJkGXjyaB3nEVpGHw6Yl8

**Note**: If you encounter Firebase authentication issues, you may need to get the complete App ID from your Firebase Console and update it in `client/src/config/local.ts`.

### 2. Install Dependencies
```bash
cd client
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The client will start on `http://localhost:5173` (or another port if 5173 is busy).

## Configuration Details

- **API Base URL**: Set to `https://localhost:7271/api` for local development
- **Firebase**: Uses local configuration instead of environment variables
- **Base Path**: Removed university server path for local development

## Troubleshooting

1. **CORS Issues**: Make sure your C# server allows requests from `http://localhost:5173`
2. **Firebase Errors**: Verify your Firebase configuration in `src/config/local.ts`
3. **API Connection**: Ensure your C# server is running on port 7271

## Production Deployment

To deploy to production:
1. Uncomment the `base` path in `vite.config.ts`
2. Set up proper environment variables
3. Update Firebase configuration for production
