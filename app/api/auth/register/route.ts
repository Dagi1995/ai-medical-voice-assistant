import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password: hashedPassword,
        credits: 10,
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (e: any) {
    console.error("Registration error:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
