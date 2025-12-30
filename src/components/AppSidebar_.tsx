import { Suspense } from "react";
import { SidebarItemNode } from "./sidebarItem";
import { Role } from "@/lib/adminRoles";
import { filterSidebarByRole } from "@/components/sidebar.filter";
import { SidebarMenuSkeleton } from "./ui/sidebar";
import { getMergedSidebarGroups } from "@/lib/sidebar.merge";

export default async function AppSidebar({ role }: { role: Role }) {
  const mergedGroups = await getMergedSidebarGroups();
  const filteredGroups = filterSidebarByRole(mergedGroups, role);

  return (
    <Suspense fallback={<SidebarMenuSkeleton />}>
       <aside className="w-64 border-r p-4 space-y-6">
      {filteredGroups.map((group) => (
        <div key={group.id}>
          <p>{group.label}</p>
          {group.items.map((item) => (
            <SidebarItemNode key={item.id} item={item} />
          ))}
        </div>
      ))}
      </aside>
    </Suspense>
  );
}
