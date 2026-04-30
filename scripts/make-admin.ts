import 'dotenv/config';
import { db } from "../config/db";
import { usersTable } from "../config/schema";
import { eq } from "drizzle-orm";

async function makeAdmin(email: string) {
  try {
    console.log(`Setting ${email} to Admin...`);

    const result = await db.update(usersTable)
      .set({ role: "Admin" })
      .where(eq(usersTable.email, email))
      .returning();

    if (result.length > 0) {
      console.log(`Success! ${email} is now an Admin.`);
    } else {
      console.log(`User with email ${email} not found in the database.`);
      console.log("Creating user as Admin...");
      await db.insert(usersTable).values({
        email: email,
        name: email.split("@")[0],
        role: "Admin",
      });
      console.log(`Success! ${email} has been created as an Admin.`);
    }
  } catch (error) {
    console.error("Failed to update user role:", error);
  }
}

const email = "zereaydagim@gmail.com";
makeAdmin(email);
