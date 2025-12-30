import { Suspense } from "react";
import { SidebarItemNode } from "./sidebarItem";
import { Role } from "@/lib/adminRoles";
import { filterSidebarByRole } from "@/components/sidebar.filter";
import { resolveIcon } from "@/lib/icon-map";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarSeparator,
} from "./ui/sidebar";
import { getMergedSidebarGroups } from "@/lib/sidebar.merge";
import { Link } from "lucide-react";
import Image from "next/image";
import { SidebarHeaderLogo } from "./SidebarHeaderLogo";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default async function AppSidebar({ role }: { role: Role }) {
  const mergedGroups = await getMergedSidebarGroups();
  const filteredGroups = filterSidebarByRole(mergedGroups, role);

  return (
    <Sidebar collapsible="icon" >
      <SidebarHeader className="py-4">
        <SidebarHeaderLogo />
      </SidebarHeader>

      <SidebarSeparator className="w-[99%]! m-auto" />
      <Suspense fallback={<SidebarMenuSkeleton />}>
        <SidebarContent className="overflow-y-auto overflow-x-visible">
                {/* <SidebarContent > */}

          {filteredGroups.map((group) => {
                        const Icon = resolveIcon((group as any).icon); // safe optional icon
return(
            <div key={group.id}>
              <SidebarGroup>
                {/* <div className="flex items-center gap-2">
                
                  {Icon && <Icon className="h-4 w-4" />}
                  <SidebarGroupLabel>
                    {group.label}
                  </SidebarGroupLabel>
                </div> */}
                <SidebarMenuItem>
  <SidebarMenuButton tooltip={group.label}>
    {Icon && <Icon />}
    <span>{group.label}</span>
  </SidebarMenuButton>
</SidebarMenuItem>

                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarItemNode key={item.id} item={item} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
             <SidebarSeparator className="w-[90%]! m-auto" />
            </div>
          )})}
        </SidebarContent>
      </Suspense>
    </Sidebar>
  );
}
