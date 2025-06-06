# Vercel Deployment Guide

## Environment Variables Required

When deploying to Vercel, you need to set these environment variables in your Vercel dashboard:

### Required Variables

```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with the appropriate value
5. Make sure to set them for all environments (Production, Preview, Development)

### Important Notes

- **NEXT_PUBLIC_APP_URL**: This should be your actual Vercel deployment URL
- **Spotify Redirect URI**: In your Spotify app settings, add your Vercel URL + `/auth/callback`
  - Example: `https://your-app-name.vercel.app/auth/callback`

## Spotify App Configuration

Make sure your Spotify app (in Spotify Developer Dashboard) has these redirect URIs:

- `http://localhost:3000/auth/callback` (for local development)
- `https://your-app-name.vercel.app/auth/callback` (for production)

## Deployment Commands

### Local Development (with backend server)

```bash
npm run dev
```

### Local Development (serverless mode - like production)

```bash
npm run dev:serverless
```

### Build for Production

```bash
npm run build
```

## Architecture Changes for Vercel

This app has been converted from using a separate backend server to using Next.js API routes (serverless functions) for Vercel compatibility:

- ✅ **Login**: `/auth/login` → Next.js API route
- ✅ **Callback**: `/auth/callback` → Next.js API route
- ✅ **Token**: `/api/auth/token` → Next.js API route
- ✅ **Authentication**: Cookie-based (no global variables)
- ✅ **Serverless**: No long-running backend server required

## Testing Deployment

1. Test locally with serverless mode: `npm run dev:serverless`
2. Ensure login/logout works without the backend server
3. Deploy to Vercel
4. Test the deployed version
5. Check Vercel function logs if there are issues
