# Environment Variables Setup Guide

This guide will help you set up all required environment variables for local development and Vercel deployment.

## Quick Start

Your `.env.local` file already exists. Follow the steps below to fill in the actual values.

---

## 1️⃣ Database (Neon PostgreSQL)

### Get Your Database URL

1. Go to [Neon.tech](https://neon.tech/)
2. Sign up or log in
3. Create a new project (or use existing)
4. Go to **Dashboard** → **Connection Details**
5. Copy the connection string (looks like `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname`)

### Update `.env.local`

```bash
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

### Run Prisma Migration (First Time Only)

```bash
npx prisma db push
```

This creates all tables in your database.

### Verify Database Connection on Neon

After running `npx prisma db push`, verify your database is properly set up:

#### Method 1: Check Tables in Neon Dashboard

1. Go to [Neon.tech](https://neon.tech/) and log in
2. Select your project
3. Click on **Tables** in the left sidebar (or **SQL Editor**)
4. You should see the following tables created:
   - `Account`
   - `Session`
   - `User`
   - `VerificationToken`
   - `Subscription`
   - `_prisma_migrations` (Prisma's internal table)

#### Method 2: Use Neon's SQL Editor

1. In your Neon dashboard, click **SQL Editor**
2. Run this query to check tables:

```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public';
```

You should see output like:
```
tablename
-------------------
Account
Session
User
VerificationToken
Subscription
_prisma_migrations
```

#### Method 3: Check Connection Status

1. In Neon dashboard, go to **Monitoring** tab
2. You should see connection activity if your app is running
3. Check **Operations** tab to see recent queries (like `SELECT` statements)

#### Troubleshooting

**If no tables appear:**
- Run `npx prisma db push` again
- Check your `DATABASE_URL` in `.env.local` is correct
- Ensure the database name matches your Neon project

**If you see "connection refused":**
- Check Neon project is not suspended (free tier suspends after inactivity)
- Click **Resume** in Neon dashboard if needed

**If you see "SSL required":**
- Ensure your connection string ends with `?sslmode=require`

---

## 2️⃣ NextAuth Secret

### Generate a Secret

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Copy the output (e.g., `kJ8s9dK3mN2pQ1rT5vW7xY0zA3bC6dE9fG2hI5jK8lM=`)

### Update `.env.local`

```bash
NEXTAUTH_SECRET="kJ8s9dK3mN2pQ1rT5vW7xY0zA3bC6dE9fG2hI5jK8lM="
NEXTAUTH_URL="http://localhost:3000"
```

**For Vercel**: Change `NEXTAUTH_URL` to your production URL (e.g., `https://yourdomain.vercel.app`)

---

## 3️⃣ Google OAuth (for Sign In)

### Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Set **Authorized JavaScript origins**:
   - `http://localhost:3000` (for local dev)
   - `https://yourdomain.vercel.app` (for production)
7. Set **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
   - `https://yourdomain.vercel.app/api/auth/callback/google` (for production)
8. Click **Create**
9. Copy your **Client ID** and **Client Secret**

### Update `.env.local`

```bash
GOOGLE_CLIENT_ID="123456789-abcdefg.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcd1234xyz"
```

---

## 4️⃣ Stripe (for Payments)

### Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up or log in
3. Toggle to **Test mode** (top right) for development
4. Go to **Developers** → **API keys**
5. Copy your **Secret key** (starts with `sk_test_`)

### Create a Product & Price

1. Go to **Products** → **Add product**
2. Name: "Pro Monthly"
3. Price: $19/month (or your price)
4. Click **Save product**
5. Copy the **Price ID** (starts with `price_`)

### Get Webhook Secret (for local testing)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will output a webhook signing secret (starts with `whsec_`)

### Update `.env.local`

```bash
STRIPE_SECRET_KEY="sk_test_51ABC..."
STRIPE_PRICE_ID_PRO_MONTHLY="price_1ABC..."
STRIPE_WEBHOOK_SECRET="whsec_123abc..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 5️⃣ Your Complete `.env.local` File

After following all steps, your `.env.local` should look like:

```bash
# Database (Neon)
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="kJ8s9dK3mN2pQ1rT5vW7xY0zA3bC6dE9fG2hI5jK8lM="

# Google OAuth
GOOGLE_CLIENT_ID="123456789-abcdefg.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcd1234xyz"

# Stripe (Test Mode)
STRIPE_SECRET_KEY="sk_test_51ABC..."
STRIPE_PRICE_ID_PRO_MONTHLY="price_1ABC..."
STRIPE_WEBHOOK_SECRET="whsec_123abc..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 6️⃣ Vercel Environment Variables

Once your local setup works, add these to Vercel:

1. Go to your Vercel project
2. **Settings** → **Environment Variables**
3. Add each variable:
   - `DATABASE_URL` → Your Neon production database URL
   - `NEXTAUTH_SECRET` → Same as local (or generate new)
   - `NEXTAUTH_URL` → `https://yourdomain.vercel.app`
   - `GOOGLE_CLIENT_ID` → Same as local
   - `GOOGLE_CLIENT_SECRET` → Same as local
   - `STRIPE_SECRET_KEY` → Use `sk_live_...` for production (not test key!)
   - `STRIPE_PRICE_ID_PRO_MONTHLY` → Your production price ID
   - `STRIPE_WEBHOOK_SECRET` → Get from Stripe → Webhooks → Add endpoint
   - `NEXT_PUBLIC_APP_URL` → `https://yourdomain.vercel.app`

### Production Stripe Webhook

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. URL: `https://yourdomain.vercel.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

---

## 7️⃣ Test Your Local Setup

### Step 1: Verify Database Connection

```bash
# Push schema to database
npx prisma db push

# You should see:
# ✔ Your database is now in sync with your Prisma schema.
```

**Then verify on Neon.tech:**
1. Go to Neon dashboard → **Tables**
2. Confirm you see: `Account`, `Session`, `User`, `VerificationToken`, `Subscription`
3. Or run this in **SQL Editor**:
   ```sql
   SELECT COUNT(*) FROM "User";
   ```
   Should return `0` (no users yet)

### Step 2: Start Development Server

```bash
# Generate Prisma Client (if needed)
npx prisma generate

# Start Next.js dev server
npm run dev

# You should see:
# ✓ Ready in 2.5s
# ○ Local:        http://localhost:3000
```

### Step 3: Test in Browser

```bash
# Open browser
open http://localhost:3000
```

### Step 4: Test Google Sign In

1. Click **Sign in** button
2. Sign in with your Google account
3. You should be redirected back to the app

**Verify in Neon:**
1. Go to Neon → **SQL Editor**
2. Run:
   ```sql
   SELECT email, name, "isPro" FROM "User";
   ```
3. You should see your user account created!

### Step 5: Test Stripe Checkout

1. Make sure Stripe webhook is running:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

2. In the app, click **Upgrade to Pro**
3. Use Stripe test card:
   - **Card number**: `4242 4242 4242 4242`
   - **Expiry**: Any future date
   - **CVC**: Any 3 digits
   - **ZIP**: Any 5 digits

4. Complete checkout

**Verify in Neon:**
```sql
SELECT u.email, s.status, s."stripePriceId"
FROM "User" u
JOIN "Subscription" s ON u.id = s."userId";
```

You should see your subscription!

---

## 🔐 Security Notes

- ✅ `.env.local` is in `.gitignore` - never commit it!
- ✅ Use test keys locally (`sk_test_...`)
- ✅ Use live keys in production (`sk_live_...`)
- ✅ Regenerate `NEXTAUTH_SECRET` for production
- ✅ Never share your secrets publicly

---

## 🆘 Troubleshooting

**Error: "Prisma Client not generated"**
```bash
npx prisma generate
```

**Error: "Google OAuth redirect mismatch"**
- Check your redirect URIs in Google Console match exactly

**Error: "Stripe webhook signature verification failed"**
- Make sure you're running `stripe listen` for local testing
- For production, verify webhook secret matches Stripe dashboard

**Database connection issues**
- Check your Neon database is running
- Verify connection string is correct
- Ensure `?sslmode=require` is at the end
