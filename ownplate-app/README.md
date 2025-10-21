# 🍽️ OwnPlate

Your sustainable meal planning companion. Replace wasteful meal kits like HelloFresh with smart recipe planning that saves money, reduces plastic waste, and gives you control over ingredient quality.

## ✨ Features

- **Recipe Management**: Add recipes manually or import via CSV
- **Smart Pantry Tracking**: Track staple ingredients and avoid buying duplicates
- **Weekly Meal Planning**: Select 5 dinners for the week
- **Intelligent Shopping Lists**: 
  - Automatically collate ingredient quantities
  - Separate fresh ingredients from pantry staples
  - Show what you already have vs. what you need to buy
- **Multi-User Support**: Separate accounts for household members
- **Vegetarian Focused**: Built for vegetarian meal planning (but works for any diet)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Vercel account (free tier works great)

### 1. Clone and Install

```bash
cd ownplate-app
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (from Vercel Postgres)
POSTGRES_URL="your-vercel-postgres-url"
POSTGRES_PRISMA_URL="your-vercel-postgres-prisma-url"
POSTGRES_URL_NON_POOLING="your-vercel-postgres-non-pooling-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-command-below"
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Set Up Vercel Postgres

1. Go to [vercel.com/storage](https://vercel.com/storage)
2. Create a new Postgres database
3. Copy the environment variables to your `.env.local`
4. The database tables will be created automatically on first run

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment to Vercel

### One-Click Deploy

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add a Vercel Postgres database:
   - Go to your project settings
   - Navigate to "Storage"
   - Create a Postgres database
5. Add environment variables:
   - Postgres variables are auto-added
   - Add `NEXTAUTH_URL` (your production URL)
   - Add `NEXTAUTH_SECRET` (generate a new one for production)
6. Deploy!

### Manual Deployment

```bash
npm run build
vercel --prod
```

## 📝 How to Use

### 1. Create an Account

Sign up with your email and password.

### 2. Add Recipes

**Option A: Manual Entry**
- Click "Add Recipe" 
- Enter recipe name, servings, ingredients (with quantities), and instructions
- Mark ingredients as "Staple" if they're pantry items (oils, sauces, spices, etc.)

**Option B: CSV Import**
- Prepare a CSV file with this format:

```csv
recipe_name,ingredient_name,quantity,unit,is_staple,instructions,servings
Stir Fry,Soy Sauce,2,tbsp,true,"Heat oil, stir fry veggies, add sauce",2
Stir Fry,Broccoli,200,g,false,"Heat oil, stir fry veggies, add sauce",2
Stir Fry,Carrots,150,g,false,"Heat oil, stir fry veggies, add sauce",2
```

- Go to "Add Recipe" → "Import CSV"
- Upload your file

### 3. Update Your Pantry

- Go to "Pantry"
- Mark which staples you currently have
- Set status: Have / Low / Out

### 4. Plan Your Week

- Go to "Meal Plan"
- Select a start date (Monday)
- Choose 5 recipes for the week
- Recipes using your existing pantry items are highlighted with ✓
- Your shopping list generates automatically!

### 5. Shop

- Print or view your shopping list
- Items are organized into:
  - **Fresh Ingredients**: Buy this week
  - **Staples to Buy**: Only if you're out
  - **Staples You Have**: Already in your pantry

## 🎯 Why OwnPlate vs HelloFresh?

| HelloFresh | OwnPlate |
|------------|----------|
| ❌ Expensive (~$10-12/serving) | ✅ Your own grocery budget |
| ❌ Lots of plastic packaging | ✅ Zero extra packaging waste |
| ❌ Pre-portioned sauce sachets | ✅ Buy full bottles, use across weeks |
| ❌ Limited ingredient quality control | ✅ Choose your own quality & brands |
| ❌ Fixed weekly delivery | ✅ Flexible planning on your schedule |

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres (PostgreSQL)
- **Authentication**: NextAuth.js
- **Hosting**: Vercel
- **CSV Parsing**: PapaParse

## 📊 Database Schema

```sql
users              # User accounts
recipes            # Your recipes
ingredients        # Master ingredient list
recipe_ingredients # Recipe ↔ Ingredient relationship
pantry             # User's current staple inventory
meal_plans         # Weekly meal plans
planned_meals      # Meal plan ↔ Recipe relationship
```

See `schema.sql` for full schema.

## 🤝 Contributing

This is a personal project, but feel free to fork and adapt for your needs!

## 📄 License

MIT License - feel free to use and modify as you wish.

## 💡 Tips & Best Practices

1. **Start with 10-15 recipes** you know well
2. **Mark staples accurately** - think: "would I buy this once and use it for months?"
3. **Update your pantry** after shopping each week
4. **Plan ahead** on weekends for the week ahead
5. **Adjust quantities** in recipes for your actual serving needs

## 🐛 Troubleshooting

**Database tables not created?**
- The app auto-creates tables on first API call
- If issues persist, run the SQL in `schema.sql` manually in Vercel Postgres dashboard

**Authentication not working?**
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your deployment URL

**Can't import CSV?**
- Check CSV format matches example
- Ensure `is_staple` is exactly "true" or "false"

## 🎉 Enjoy Your Sustainable Meal Planning!

Questions or issues? Check the code comments or create an issue.
