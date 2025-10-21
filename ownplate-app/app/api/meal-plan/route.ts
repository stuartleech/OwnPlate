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
    const { weekStartDate, meals } = await request.json();

    if (!weekStartDate || !meals || meals.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create or update meal plan
    const mealPlanResult = await sql`
      INSERT INTO meal_plans (user_id, week_start_date)
      VALUES (${userId}, ${weekStartDate})
      ON CONFLICT (user_id, week_start_date)
      DO UPDATE SET week_start_date = ${weekStartDate}
      RETURNING id
    `;

    const mealPlanId = mealPlanResult.rows[0].id;

    // Delete existing planned meals for this plan
    await sql`
      DELETE FROM planned_meals WHERE meal_plan_id = ${mealPlanId}
    `;

    // Add new planned meals
    for (const meal of meals) {
      await sql`
        INSERT INTO planned_meals (meal_plan_id, recipe_id, day_of_week)
        VALUES (${mealPlanId}, ${meal.recipeId}, ${meal.dayOfWeek})
      `;
    }

    return NextResponse.json({ success: true, mealPlanId });
  } catch (error) {
    console.error("Meal plan save error:", error);
    return NextResponse.json(
      { error: "Failed to save meal plan" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Get recent meal plans
    const plans = await sql`
      SELECT 
        mp.id,
        mp.week_start_date,
        COUNT(pm.id) as meal_count
      FROM meal_plans mp
      LEFT JOIN planned_meals pm ON mp.id = pm.meal_plan_id
      WHERE mp.user_id = ${userId}
      GROUP BY mp.id
      ORDER BY mp.week_start_date DESC
      LIMIT 10
    `;

    return NextResponse.json({ plans: plans.rows });
  } catch (error) {
    console.error("Meal plans fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plans" },
      { status: 500 }
    );
  }
}

