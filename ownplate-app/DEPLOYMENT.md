# 🚀 Deploy OwnPlate to Vercel

Your code is now on GitHub! Here's how to deploy it to Vercel.

## Your Database Info

You've already created a Vercel Postgres database:
- **ID**: `ecfg_xeujshcvgwb2pe4v0k7mrsp8ieun`

## Step-by-Step Deployment

### 1. Import Your GitHub Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Find and select: `stuartleech/OwnPlate`
4. Click **"Import"**

### 2. Configure Project

When setting up the project:

- **Project Name**: `ownplate` (or whatever you prefer)
- **Framework Preset**: Next.js (should auto-detect)
- **Root Directory**: `ownplate-app` ← **IMPORTANT!** Click "Edit" and set this
- **Build Command**: `npm run build` (default is fine)
- **Output Directory**: `.next` (default is fine)

### 3. Connect Your Postgres Database

Before deploying, connect your database:

1. In the project setup screen, go to **Storage** tab
2. Click **"Connect Store"**
3. Select **"Postgres"**
4. Find your existing database (ID: ecfg_xeujshcvgwb2pe4v0k7mrsp8ieun)
5. Click **"Connect"**

This will automatically add these environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### 4. Add Environment Variables

Still in the project setup, go to **Environment Variables** section and add:

```
NEXTAUTH_SECRET
```
**Value**: Generate a new one for production:
```bash
openssl rand -base64 32
```

**IMPORTANT**: Do NOT add `NEXTAUTH_URL` - Vercel sets this automatically!

### 5. Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. You'll get a URL like: `https://ownplate-xxx.vercel.app`

### 6. Test Your Deployment

1. Visit your Vercel URL
2. Click "Sign Up" and create an account
3. The database tables will be created automatically on first use!

## Troubleshooting

### Build Fails?

**Check Root Directory**: Make sure you set `ownplate-app` as the root directory!

### Database Connection Issues?

1. Go to your project → Settings → Storage
2. Verify the Postgres database is connected
3. Check Environment Variables tab - should see `POSTGRES_*` variables

### Authentication Not Working?

1. Go to Settings → Environment Variables
2. Make sure `NEXTAUTH_SECRET` is set
3. DO NOT set `NEXTAUTH_URL` manually (Vercel handles this)

### Tables Not Created?

The app auto-creates tables on first API call. If issues:
1. Go to Vercel Storage → Your Postgres database
2. Click "Query" tab
3. Copy/paste the contents of `schema.sql` and run it

## After Deployment

### Custom Domain (Optional)

1. Go to your project → Settings → Domains
2. Add your custom domain
3. Follow DNS instructions

### Invite Your Household

Send them your Vercel URL and they can create their own accounts!

## Environment Variables Summary

Your production environment should have:

✅ `POSTGRES_URL` (auto-added by connecting database)  
✅ `POSTGRES_PRISMA_URL` (auto-added by connecting database)  
✅ `POSTGRES_URL_NON_POOLING` (auto-added by connecting database)  
✅ `NEXTAUTH_SECRET` (you add this manually)  
❌ `NEXTAUTH_URL` (don't add - Vercel sets automatically)

## Update Deployment

When you make changes:

```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will automatically redeploy!

## 🎉 You're Live!

Once deployed, you can:
- Access from anywhere
- Share with household members
- Use on phone, tablet, or desktop
- All data synced via Postgres database

Enjoy your sustainable meal planning! 🍽️

