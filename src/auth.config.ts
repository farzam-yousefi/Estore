// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";
import { getToken } from "next-auth/jwt";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login", // default login page for non-admin routes
  },
  callbacks: {
    async authorized({ auth, request }) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });
      const role = token?.role || "";

      const isLoggedIn = !!auth?.user;

      const pathname = request.nextUrl.pathname;
      console.log("======================");
      console.log(auth);
      console.log(pathname);
      console.log(role);

      // ===== ADMIN ROUTES =====

      // Optional: restrict roles
      if (
        pathname.startsWith("/admin") &&
        isLoggedIn &&
        "user".includes(role)
      ) {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }
   
      // ===== ADMIN ROUTES =====
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn && !pathname.startsWith("/admin/login")) {
          return Response.redirect(new URL("/admin/login", request.nextUrl));
        }

        

        
        

        return true;
      }

      

      // ===== USER ROUTES =====
      // Dashboard / cart
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/cart")) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/login", request.nextUrl));
        }
        return true;
      }

     
      return true;
    },
  },
  providers: [], // your providers are defined in src/auth.ts
} satisfies NextAuthConfig;
