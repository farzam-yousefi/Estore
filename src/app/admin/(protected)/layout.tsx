import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";

export default async function adminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar role="admin" />
        <main className="w-full">
          <SessionProvider>
            {" "}
            <Navbar />
          </SessionProvider>
          <div className="px-4">{children}</div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
