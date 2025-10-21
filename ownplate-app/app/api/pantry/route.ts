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

    const pantry = await sql`
      SELECT 
        p.id,
        p.ingredient_id as "ingredientId",
        i.name as "ingredientName",
        p.status
      FROM pantry p
      JOIN ingredients i ON p.ingredient_id = i.id
      WHERE p.user_id = ${userId}
      ORDER BY i.name
    `;

    return NextResponse.json({ pantry: pantry.rows });
  } catch (error) {
    console.error("Pantry fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pantry" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { ingredientId, status } = await request.json();

    if (!ingredientId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upsert pantry item
    await sql`
      INSERT INTO pantry (user_id, ingredient_id, status, updated_at)
      VALUES (${userId}, ${ingredientId}, ${status}, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, ingredient_id)
      DO UPDATE SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pantry update error:", error);
    return NextResponse.json(
      { error: "Failed to update pantry" },
      { status: 500 }
    );
  }
}

