// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: "superAdmin" | "admin" | "user";
    } & DefaultSession["user"];
  }

  interface User {
    role: "superAdmin" | "admin" | "user";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "superAdmin" | "admin" | "user";
  }
}
