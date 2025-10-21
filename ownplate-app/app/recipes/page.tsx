import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";
import Link from "next/link";

export default async function RecipesPage() {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  const userId = parseInt(session.user.id);

  // Get all recipes with ingredient count
  const recipes = await sql`
    SELECT 
      r.id,
      r.name,
      r.instructions,
      r.servings,
      r.created_at,
      COUNT(ri.id) as ingredient_count,
      COUNT(CASE WHEN i.is_staple = true THEN 1 END) as staple_count
    FROM recipes r
    LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
    LEFT JOIN ingredients i ON ri.ingredient_id = i.id
    WHERE r.user_id = ${userId}
    GROUP BY r.id
    ORDER BY r.created_at DESC
  `;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
          <p className="text-gray-600 mt-2">Manage your recipe collection</p>
        </div>
        <Link
          href="/recipes/new"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          + Add Recipe
        </Link>
      </div>

      {recipes.rows.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">No recipes yet</h2>
          <p className="text-gray-600 mb-6">Start building your recipe collection</p>
          <Link
            href="/recipes/new"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Add Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.rows.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow hover:shadow-md transition">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{recipe.name}</h3>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <span>🥘 {recipe.servings} servings</span>
                  <span>🛒 {recipe.ingredient_count} ingredients</span>
                </div>
                {parseInt(recipe.staple_count) > 0 && (
                  <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-4">
                    ✓ Uses pantry staples
                  </div>
                )}
                <div className="flex gap-2">
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded transition"
                  >
                    View
                  </Link>
                  <Link
                    href={`/recipes/${recipe.id}/edit`}
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

