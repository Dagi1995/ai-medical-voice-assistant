export const runtime = "nodejs";

import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "m@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        
        const user = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, credentials.email));
          
        if (user.length === 0) {
          throw new Error("User not found");
        }
        
        const passwordMatch = await bcrypt.compare(credentials.password, user[0].password);
        
        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }
        
        return {
          id: user[0].id,
          name: user[0].name,
          email: user[0].email,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecret"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
