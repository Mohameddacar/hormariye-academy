import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm"; // <-- muhiim

export async function POST(req) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    // Check if user exists
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existing.length > 0) {
      return NextResponse.json(existing[0]);
    }

    // Create new user with default values
    const [created] = await db
      .insert(usersTable)
      .values({ 
        name: name || "User", 
        email,
        subscriptionPlan: "free"
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/user error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
