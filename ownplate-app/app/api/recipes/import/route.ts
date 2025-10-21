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
    const { recipes } = await request.json();

    if (!recipes || !Array.isArray(recipes)) {
      return NextResponse.json(
        { error: "Invalid CSV data" },
        { status: 400 }
      );
    }

    // Group by recipe name
    const recipeMap = new Map<string, any>();

    for (const row of recipes) {
      const recipeName = row.recipe_name?.trim();
      if (!recipeName) continue;

      if (!recipeMap.has(recipeName)) {
        recipeMap.set(recipeName, {
          name: recipeName,
          instructions: row.instructions || "",
          servings: parseInt(row.servings) || 2,
          ingredients: [],
        });
      }

      const ingredientName = row.ingredient_name?.trim();
      if (ingredientName) {
        recipeMap.get(recipeName).ingredients.push({
          name: ingredientName,
          quantity: parseFloat(row.quantity) || 0,
          unit: row.unit || "",
          isStaple: row.is_staple?.toLowerCase() === "true",
        });
      }
    }

    let importedCount = 0;

    // Create recipes
    for (const [_, recipeData] of recipeMap) {
      if (recipeData.ingredients.length === 0) continue;

      try {
        // Create recipe
        const recipeResult = await sql`
          INSERT INTO recipes (user_id, name, instructions, servings)
          VALUES (${userId}, ${recipeData.name}, ${recipeData.instructions}, ${recipeData.servings})
          RETURNING id
        `;

        const recipeId = recipeResult.rows[0].id;

        // Process ingredients
        for (const ingredient of recipeData.ingredients) {
          // Check if ingredient exists
          let ingredientResult = await sql`
            SELECT id FROM ingredients WHERE LOWER(name) = LOWER(${ingredient.name})
          `;

          let ingredientId;
          if (ingredientResult.rows.length === 0) {
            // Create new ingredient
            const newIngredient = await sql`
              INSERT INTO ingredients (name, is_staple, unit)
              VALUES (${ingredient.name}, ${ingredient.isStaple}, ${ingredient.unit})
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
            VALUES (${recipeId}, ${ingredientId}, ${ingredient.quantity}, ${ingredient.unit})
          `;
        }

        importedCount++;
      } catch (error) {
        console.error(`Failed to import recipe ${recipeData.name}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedCount,
      total: recipeMap.size,
    });
  } catch (error) {
    console.error("CSV import error:", error);
    return NextResponse.json(
      { error: "Failed to import recipes" },
      { status: 500 }
    );
  }
}

