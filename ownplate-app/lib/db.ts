import { sql } from '@vercel/postgres';

export { sql };

// Helper function to initialize database
export async function initializeDatabase() {
  try {
    // Check if tables exist by querying for users table
    await sql`SELECT 1 FROM users LIMIT 1`;
  } catch (error) {
    // Tables don't exist, create them
    console.log('Initializing database...');
    
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Recipes table
    await sql`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        instructions TEXT,
        servings INTEGER DEFAULT 2,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Ingredients table
    await sql`
      CREATE TABLE IF NOT EXISTS ingredients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        is_staple BOOLEAN DEFAULT FALSE,
        unit VARCHAR(50)
      )
    `;

    // Recipe ingredients junction table
    await sql`
      CREATE TABLE IF NOT EXISTS recipe_ingredients (
        id SERIAL PRIMARY KEY,
        recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
        ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
        quantity DECIMAL(10, 2) NOT NULL,
        unit VARCHAR(50),
        UNIQUE(recipe_id, ingredient_id)
      )
    `;

    // Pantry table
    await sql`
      CREATE TABLE IF NOT EXISTS pantry (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'have',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, ingredient_id)
      )
    `;

    // Meal plans table
    await sql`
      CREATE TABLE IF NOT EXISTS meal_plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        week_start_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, week_start_date)
      )
    `;

    // Planned meals table
    await sql`
      CREATE TABLE IF NOT EXISTS planned_meals (
        id SERIAL PRIMARY KEY,
        meal_plan_id INTEGER REFERENCES meal_plans(id) ON DELETE CASCADE,
        recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
        day_of_week INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_pantry_user_id ON pantry(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_planned_meals_meal_plan_id ON planned_meals(meal_plan_id)`;

    console.log('Database initialized successfully');
  }
}

