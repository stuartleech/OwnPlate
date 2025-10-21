import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Get all recipes with information about whether they use staples we have
    const recipes = await sql`
      SELECT 
        r.id,
        r.name,
        r.servings,
        COUNT(DISTINCT ri.id) as ingredient_count,
        COUNT(DISTINCT CASE 
          WHEN i.is_staple = true AND (p.status = 'have' OR p.status = 'low') 
          THEN i.id 
        END) as staples_we_have,
        COUNT(DISTINCT CASE 
          WHEN i.is_staple = true 
          THEN i.id 
        END) as total_staples
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      LEFT JOIN ingredients i ON ri.ingredient_id = i.id
      LEFT JOIN pantry p ON i.id = p.ingredient_id AND p.user_id = ${userId}
      WHERE r.user_id = ${userId}
      GROUP BY r.id
      ORDER BY r.name
    `;

    // Add usesStaples flag
    const recipesWithFlags = recipes.rows.map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      servings: recipe.servings,
      ingredientCount: parseInt(recipe.ingredient_count),
      usesStaples: parseInt(recipe.staples_we_have) > 0,
    }));

    return NextResponse.json({ recipes: recipesWithFlags });
  } catch (error) {
    console.error("Recipes fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

