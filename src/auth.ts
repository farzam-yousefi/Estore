// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { getCollection } from "@/lib/db";
import { DbUser } from "@/lib/user";

export const {
  handlers,   
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    // ======================
    // Credentials Provider
    // ======================
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const users = await getCollection<DbUser>("users");
        if (!users) return null;

        const user = await users.findOne({
          email: credentials.email,
          provider: "credentials",
        });

        if (!user || typeof user.passwordHash !== "string") return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user._id!.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),

    // ======================
    // Google Provider
    // ======================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // ======================
    // Google DB handling
    // ======================
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        const users = await getCollection<DbUser>("users");
        if (!users) return false;

        const existing = await users.findOne({ email: user.email });

        // ❌ Block admins from Google login
        if (
          existing?.role === "admin" ||
          existing?.role === "superAdmin"
        ) {
          return false;
        }

        if (!existing) {
          await users.insertOne({
            email: user.email,
            role: "user",
            provider: "google",
            isActive: true,
            createdAt: new Date(),
          });
        }

        user.role = existing?.role ?? "user";
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as
          | "superAdmin"
          | "admin"
          | "user";
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.includes("/api/auth/callback/google")) {
        return baseUrl + "/dashboard";
      }
      return url;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});
