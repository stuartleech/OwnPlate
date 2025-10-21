# 🚀 Quick Start Guide

Get OwnPlate running in 5 minutes!

## Step 1: Create Vercel Account & Database

1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Go to [vercel.com/storage](https://vercel.com/storage)
3. Click "Create Database" → "Postgres"
4. Name it (e.g., "ownplate-db")
5. Select a region close to you
6. Click "Create"

## Step 2: Get Database Credentials

1. In your new Postgres database, click ".env.local" tab
2. Copy all the `POSTGRES_*` variables

## Step 3: Set Up Environment

Create `/Users/stuartleech/OwnPlate/ownplate-app/.env.local`:

```env
# Paste the POSTGRES variables from Vercel here
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NON_POOLING="..."

# Add these
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="YOUR_SECRET_HERE"
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Step 4: Install & Run

```bash
cd /Users/stuartleech/OwnPlate/ownplate-app
npm install
npm run dev
```

## Step 5: Create Account & Import Sample Recipes

1. Open http://localhost:3000
2. Click "Sign Up" and create an account
3. Go to "Recipes" → "Add Recipe" → "Import CSV"
4. Upload `example-recipes.csv`
5. Go to "Pantry" and mark which staples you have
6. Go to "Meal Plan" and select 5 dinners!

## Next: Deploy to Production

When ready to deploy:

```bash
cd /Users/stuartleech/OwnPlate/ownplate-app
vercel
```

Follow the prompts, then:
1. Go to your Vercel project dashboard
2. Add the same Postgres database (Storage → Connect)
3. Update environment variable `NEXTAUTH_URL` to your production URL
4. Add `NEXTAUTH_SECRET` (generate a new one for production)

Done! 🎉

