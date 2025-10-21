import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  const userId = parseInt(session.user.id);
  const recipeId = parseInt(params.id);

  // Get recipe details
  const recipeResult = await sql`
    SELECT * FROM recipes 
    WHERE id = ${recipeId} AND user_id = ${userId}
  `;

  if (recipeResult.rows.length === 0) {
    notFound();
  }

  const recipe = recipeResult.rows[0];

  // Get ingredients
  const ingredientsResult = await sql`
    SELECT 
      i.name,
      ri.quantity,
      ri.unit,
      i.is_staple
    FROM recipe_ingredients ri
    JOIN ingredients i ON ri.ingredient_id = i.id
    WHERE ri.recipe_id = ${recipeId}
    ORDER BY i.name
  `;

  const ingredients = ingredientsResult.rows;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/recipes" className="text-green-600 hover:text-green-700 font-semibold">
          ← Back to Recipes
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
              <p className="text-gray-600">Servings: {recipe.servings}</p>
            </div>
            <Link
              href={`/recipes/${recipeId}/edit`}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Edit Recipe
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>
                      {ingredient.quantity} {ingredient.unit} {ingredient.name}
                      {ingredient.is_staple && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Staple
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
              <div className="prose max-w-none">
                {recipe.instructions ? (
                  <p className="whitespace-pre-wrap text-gray-700">{recipe.instructions}</p>
                ) : (
                  <p className="text-gray-400 italic">No instructions provided</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

