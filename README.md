# SaaS Deal Calculator

A Next.js application for modeling SaaS deal economics with PDF export as a paid Pro feature.

## Quick Start

The app is experiencing an AuthJS configuration error. To fix this, you need to set up proper environment variables.

### Immediate Fix

1. **Copy the `.env.local` file and replace dummy values with real credentials**

2. **Get Google OAuth Credentials** (https://console.cloud.google.com):
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Secret to `.env.local`

3. **Get Database** (https://neon.tech - free tier):
   - Create a PostgreSQL database
   - Copy connection string to `.env.local` as `DATABASE_URL`
   - Run: `npx prisma migrate dev --name init`

4. **Get Stripe Keys** (https://dashboard.stripe.com):
   - Create a monthly subscription product
   - Copy Price ID and Secret Key to `.env.local`
   - For webhooks, use Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

5. **Generate NextAuth Secret**:
   ```bash
   openssl rand -base64 32
   ```
   Add to `.env.local` as `NEXTAUTH_SECRET`

6. **Restart the dev server**:
   ```bash
   npm run dev
   ```

## Current Error

The error "Failed to execute 'json' on 'Response': Unexpected end of JSON input" means NextAuth can't initialize because:
- Google OAuth credentials are placeholder values
- Or the NEXTAUTH_SECRET is missing/invalid

Once you add real credentials, the error will resolve.

## Full Documentation

See `.env.example` for all required environment variables.

## Features

- Deal modeling with MRR/ARR/TCV
- Profitability analysis
- Deal comparison matrix  
- **Pro Feature**: PDF Export (requires Stripe subscription)

## Tech Stack

- Next.js 15 + React 19
- NextAuth.js (Google OAuth)
- Prisma + PostgreSQL
- Stripe (payments)
- Tailwind CSS
