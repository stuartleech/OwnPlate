# 🚀 Deploy OwnPlate to Netlify

Simple guide to get OwnPlate running on Netlify with a free Postgres database.

## Part 1: Get Free Postgres Database (2 minutes)

### Option A: Neon (Recommended - Simplest)

1. Go to [neon.tech](https://neon.tech)
2. Click **"Sign Up"** (free, no credit card)
3. Click **"Create a Project"**
4. Name it: `ownplate`
5. Choose a region close to you
6. Click **"Create Project"**
7. **Copy the connection string** - it looks like:
   ```
   postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb
   ```
8. Keep this tab open - you'll need it!

### Option B: Supabase (Also Great)

1. Go to [supabase.com](https://supabase.com)
2. Sign up and create new project
3. Go to Settings → Database
4. Copy the "Connection string" (URI format)

---

## Part 2: Deploy to Netlify (3 minutes)

### Step 1: Import Your Repository

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"GitHub"**
4. Select **`stuartleech/OwnPlate`**
5. Click **"Import"**

### Step 2: Configure Build Settings

**IMPORTANT:** Set these before deploying:

- **Base directory**: `ownplate-app` ← Click "Edit" and set this!
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Functions directory**: (leave empty)

### Step 3: Add Environment Variables

Click **"Add environment variables"** and add these 4 variables:

**Variable 1: POSTGRES_URL**
- Key: `POSTGRES_URL`
- Value: [Your Neon connection string from Part 1]

**Variable 2: POSTGRES_PRISMA_URL**
- Key: `POSTGRES_PRISMA_URL`
- Value: [Same connection string]`?pgbouncer=true&connect_timeout=15`

**Variable 3: POSTGRES_URL_NON_POOLING**
- Key: `POSTGRES_URL_NON_POOLING`
- Value: [Same connection string]

**Variable 4: NEXTAUTH_SECRET**
- Key: `NEXTAUTH_SECRET`
- Value: Generate by running this in your terminal:
  ```bash
  openssl rand -base64 32
  ```

**Variable 5: NEXTAUTH_URL**
- Key: `NEXTAUTH_URL`
- Value: `https://your-site-name.netlify.app` (you can update this after deployment with your actual URL)

### Step 4: Deploy!

Click **"Deploy [your-site-name]"** and wait 2-3 minutes!

---

## Part 3: After First Deployment

### Update NEXTAUTH_URL

1. Once deployed, Netlify will give you a URL like: `https://gleaming-unicorn-abc123.netlify.app`
2. Go to **Site settings** → **Environment variables**
3. Edit `NEXTAUTH_URL` and update it to your actual Netlify URL
4. Click **"Save"**
5. **Trigger a redeploy**: Go to **Deploys** → Click **"Trigger deploy"** → **"Deploy site"**

### Custom Domain (Optional)

1. Go to **Domain settings**
2. Click **"Add domain"**
3. Follow the instructions to add your custom domain
4. Update `NEXTAUTH_URL` to your custom domain

---

## ✅ Test Your App

1. Visit your Netlify URL
2. Click **"Sign Up"** and create an account
3. Database tables are created automatically!
4. Import the sample recipes from `example-recipes.csv`
5. Start planning meals! 🍽️

---

## 🔄 Making Updates

When you make changes to your code:

```bash
git add .
git commit -m "Your changes"
git push
```

Netlify will automatically redeploy!

---

## 🐛 Troubleshooting

### "Base directory not found"
- Make sure you set **Base directory** to `ownplate-app` in Site settings → Build & deploy → Build settings

### "Database connection failed"
- Check your `POSTGRES_URL` is correct
- Make sure the connection string doesn't have extra spaces
- Verify your Neon database is active (check Neon console)

### "NEXTAUTH_SECRET is not defined"
- Go to Site settings → Environment variables
- Add `NEXTAUTH_SECRET` with a value from `openssl rand -base64 32`
- Redeploy

### Authentication not working
- Make sure `NEXTAUTH_URL` matches your actual Netlify URL (including https://)
- Redeploy after updating `NEXTAUTH_URL`

---

## 📊 Environment Variables Summary

Your Netlify environment variables should have:

✅ `POSTGRES_URL` = Your Neon connection string  
✅ `POSTGRES_PRISMA_URL` = Connection string + `?pgbouncer=true&connect_timeout=15`  
✅ `POSTGRES_URL_NON_POOLING` = Your Neon connection string  
✅ `NEXTAUTH_SECRET` = Random secret from openssl  
✅ `NEXTAUTH_URL` = Your Netlify site URL  

---

## 🎉 You're Live on Netlify!

Much simpler than Vercel's marketplace approach! Now you can:
- Access from anywhere
- Share with household members
- Plan sustainable meals
- Save money and reduce waste

Enjoy! 🍽️

