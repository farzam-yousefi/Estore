// components/SidebarHeaderLogo.tsx
"use client";

import { SidebarMenuButton, SidebarMenuItem, SidebarMenu } from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";

export function SidebarHeaderLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/">
            <Image
              src="/logo.webp"
              alt="logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span>Cozy Closet</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
