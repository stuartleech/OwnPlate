import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { name, instructions, servings, ingredients } = await request.json();

    if (!name || !ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create recipe
    const recipeResult = await sql`
      INSERT INTO recipes (user_id, name, instructions, servings)
      VALUES (${userId}, ${name}, ${instructions || ""}, ${servings || 2})
      RETURNING id
    `;

    const recipeId = recipeResult.rows[0].id;

    // Process ingredients
    for (const ingredient of ingredients) {
      if (!ingredient.name || !ingredient.quantity) continue;

      // Check if ingredient exists
      let ingredientResult = await sql`
        SELECT id FROM ingredients WHERE LOWER(name) = LOWER(${ingredient.name})
      `;

      let ingredientId;
      if (ingredientResult.rows.length === 0) {
        // Create new ingredient
        const newIngredient = await sql`
          INSERT INTO ingredients (name, is_staple, unit)
          VALUES (${ingredient.name}, ${ingredient.isStaple || false}, ${ingredient.unit || ""})
          RETURNING id
        `;
        ingredientId = newIngredient.rows[0].id;
      } else {
        ingredientId = ingredientResult.rows[0].id;
        
        // Update staple status if needed
        if (ingredient.isStaple) {
          await sql`
            UPDATE ingredients 
            SET is_staple = true 
            WHERE id = ${ingredientId}
          `;
        }
      }

      // Link ingredient to recipe
      await sql`
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        VALUES (${recipeId}, ${ingredientId}, ${ingredient.quantity}, ${ingredient.unit || ""})
      `;
    }

    return NextResponse.json({ success: true, recipeId }, { status: 201 });
  } catch (error) {
    console.error("Recipe creation error:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const recipes = await sql`
      SELECT 
        r.id,
        r.name,
        r.instructions,
        r.servings,
        r.created_at
      FROM recipes r
      WHERE r.user_id = ${userId}
      ORDER BY r.created_at DESC
    `;

    return NextResponse.json({ recipes: recipes.rows });
  } catch (error) {
    console.error("Recipes fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

