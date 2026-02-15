// import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { auth } from "@/auth";
import { filterSidebarByRole } from "@/components/sidebar.filter";
import { getMergedSidebarGroups } from "@/lib/sidebar.merge";
import { isAdminRole } from "@/lib/role-guards";
import { MergedSidebarGroup } from "@/types/sidebar.types";
import { AppSidebar } from "@/components/AppSidebar";
import { ClientOnly } from "@/components/clientOnly";

export default async function adminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const session = await auth();
  const role = session?.user?.role ?? "guest";
  let filteredGroups: MergedSidebarGroup[] = [];

  const mergedGroups = await getMergedSidebarGroups();
  if (isAdminRole(role)) {
    filteredGroups = JSON.parse(
      JSON.stringify(filterSidebarByRole(mergedGroups, role)),
    );
  }
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <ClientOnly>
          <AppSidebar groups={filteredGroups} />
        </ClientOnly>
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
