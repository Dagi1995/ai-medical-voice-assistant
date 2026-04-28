import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  try {
    const users = await db
      .select()
      .from(usersTable)
      //@ts-ignore
      .where(eq(usersTable.email, session?.user?.email));

    if (users.length === 0) {
      const result = await db
        .insert(usersTable)
        .values({
          //@ts-ignore
          name: session?.user?.name,
          email: session?.user?.email,
          credits: 10,
        })
        //@ts-ignore
        .returning({ usersTable });

      // Notify external services of the new user addition
      await db.execute(sql`NOTIFY user_update, 'new_user'`);

      return NextResponse.json(result[0]?.usersTable);
    }
    return NextResponse.json(users[0]);
  } catch (e) {
    return NextResponse.json(e);
  }
}
