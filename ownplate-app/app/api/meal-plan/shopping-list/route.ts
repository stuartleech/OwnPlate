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
    const { recipeIds } = await request.json();

    if (!recipeIds || recipeIds.length === 0) {
      return NextResponse.json({ shoppingList: [] });
    }

    // Get all ingredients for selected recipes, aggregated
    const ingredients = await sql`
      SELECT 
        i.name as ingredient_name,
        SUM(ri.quantity) as total_quantity,
        ri.unit,
        i.is_staple,
        COALESCE(p.status, 'out') as pantry_status
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.id
      LEFT JOIN pantry p ON i.id = p.ingredient_id AND p.user_id = ${userId}
      WHERE ri.recipe_id = ANY(${recipeIds})
      GROUP BY i.id, i.name, ri.unit, i.is_staple, p.status
      ORDER BY i.is_staple, i.name
    `;

    // Format shopping list
    const shoppingList = ingredients.rows.map(item => ({
      ingredientName: item.ingredient_name,
      totalQuantity: parseFloat(item.total_quantity),
      unit: item.unit || "",
      isStaple: item.is_staple,
      needToBuy: item.is_staple ? (item.pantry_status === 'out') : true,
    }));

    return NextResponse.json({ shoppingList });
  } catch (error) {
    console.error("Shopping list generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate shopping list" },
      { status: 500 }
    );
  }
}

