# 🔐 Google OAuth Setup Guide

## Quick Setup Steps

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create/Select Project
- Create a new project or select an existing one
- Note your project name

### 3. Enable Google+ API
- Go to "APIs & Services" → "Library"
- Search for "Google+ API" 
- Click "Enable"

### 4. Create OAuth 2.0 Credentials
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth 2.0 Client IDs"
- Choose "Web application"
- Add these Authorized redirect URIs:
  - `http://localhost:3003/api/auth/callback/google` (current port)
  - `http://localhost:3000/api/auth/callback/google` (backup)
  - `http://localhost:3001/api/auth/callback/google` (backup)
  - `http://localhost:3002/api/auth/callback/google` (backup)

### 5. Copy Credentials
- Copy your **Client ID** and **Client Secret**
- Open `.env.local` file in your project
- Replace the placeholder values:

```bash
NEXTAUTH_URL=http://localhost:3003
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

### 6. Generate Secret Key
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

### 7. Restart Server
After updating `.env.local`:
```bash
npm run dev
```

## ✅ Test the Setup

1. Go to `http://localhost:3003/landing`
2. Click "Sign In" button
3. You should be redirected to Google OAuth
4. After signing in, you'll be redirected to `/app`

## 🚨 Common Issues

- **"client_id is required"**: Make sure GOOGLE_CLIENT_ID is set in `.env.local`
- **"redirect_uri_mismatch"**: Add the correct redirect URI in Google Console
- **"invalid_client"**: Check that Client ID and Secret are correct

## 📱 Current App Status

- ✅ App running on: `http://localhost:3003`
- ✅ Authentication pages created
- ✅ Error handling implemented
- ⏳ Waiting for Google OAuth credentials

**Once you add the credentials, the Google sign-in button will work!**
