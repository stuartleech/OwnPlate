import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all staple ingredients
    const staples = await sql`
      SELECT id, name, is_staple
      FROM ingredients
      WHERE is_staple = true
      ORDER BY name
    `;

    return NextResponse.json({ staples: staples.rows });
  } catch (error) {
    console.error("Staples fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch staples" },
      { status: 500 }
    );
  }
}

