# Google OAuth Setup Guide

## 🚀 Quick Setup for Google Authentication

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)

### 2. Update Environment Variables

Copy the `.env.local` file and update with your credentials:

```bash
# Google OAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### 3. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

### 4. Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/landing`
3. Click "Sign In" button
4. You should be redirected to Google OAuth
5. After signing in, you'll be redirected to `/app`

## 🔒 Security Notes

- **Never commit** `.env.local` to version control
- Use different credentials for development and production
- Set up proper CORS and redirect URIs for production
- Consider using environment-specific OAuth apps

## 🎯 Features Added

✅ **Google OAuth Integration**
- Sign in with Google account
- User profile display
- Secure session management

✅ **Protected Routes**
- `/app` requires authentication
- `/api/analyze-tweet` requires authentication
- Public access to `/landing` and `/auth/signin`

✅ **User Interface**
- User menu with profile picture
- Sign in/out functionality
- Responsive design

## 🚀 Ready to Use!

Your app now requires Google authentication to access the tweet analyzer. Users must sign in with their Google account to use the virality analysis features.
