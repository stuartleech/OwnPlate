import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  const userId = parseInt(session.user.id);

  // Get stats
  const recipeCount = await sql`SELECT COUNT(*) as count FROM recipes WHERE user_id = ${userId}`;
  const pantryCount = await sql`SELECT COUNT(*) as count FROM pantry WHERE user_id = ${userId} AND status = 'have'`;
  const mealPlanCount = await sql`
    SELECT COUNT(*) as count 
    FROM meal_plans 
    WHERE user_id = ${userId} 
    AND week_start_date >= CURRENT_DATE - INTERVAL '7 days'
  `;

  const recipes = parseInt(recipeCount.rows[0]?.count || 0);
  const pantryItems = parseInt(pantryCount.rows[0]?.count || 0);
  const activePlans = parseInt(mealPlanCount.rows[0]?.count || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session.user.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">Here's your meal planning overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Recipes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{recipes}</p>
            </div>
            <div className="text-4xl">📖</div>
          </div>
          <Link href="/recipes" className="text-sm text-green-600 hover:text-green-700 mt-4 inline-block">
            Manage recipes →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pantry Staples</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{pantryItems}</p>
            </div>
            <div className="text-4xl">🥫</div>
          </div>
          <Link href="/pantry" className="text-sm text-green-600 hover:text-green-700 mt-4 inline-block">
            Update pantry →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Meal Plans</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{activePlans}</p>
            </div>
            <div className="text-4xl">🗓️</div>
          </div>
          <Link href="/meal-plan" className="text-sm text-green-600 hover:text-green-700 mt-4 inline-block">
            Plan this week →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/recipes/new"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 transition"
          >
            <div className="text-2xl">➕</div>
            <div>
              <h3 className="font-semibold">Add New Recipe</h3>
              <p className="text-sm text-gray-600">Create or import a recipe</p>
            </div>
          </Link>

          <Link
            href="/meal-plan"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 transition"
          >
            <div className="text-2xl">📅</div>
            <div>
              <h3 className="font-semibold">Plan This Week</h3>
              <p className="text-sm text-gray-600">Select 5 dinners and get your shopping list</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

