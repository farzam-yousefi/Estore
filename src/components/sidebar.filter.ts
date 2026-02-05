import { SidebarItem, MergedSidebarGroup } from "@/types/sidebar.types";
import { AdminRole } from "@/types/Roles";

function filterItemsByRole(
  items: SidebarItem[],
  role: AdminRole,
): SidebarItem[] {
  return items
    .filter((item) => item.roles.includes(role) && !item.hidden)
    .map((item) => {
      if (!item.children) return item;

      const filteredChildren = filterItemsByRole(item.children, role);

      if (filteredChildren.length === 0 && !item.url) {
        return null;
      }
      return {
        ...item,
        children: filteredChildren,
      };
    })
    .filter(Boolean) as SidebarItem[];
}

export function filterSidebarByRole(
  groups: MergedSidebarGroup[],
  role: AdminRole,
): MergedSidebarGroup[] {
  return groups
    .map((group) => {
      const items = filterItemsByRole(group.items, role);
      if (items.length === 0) return null;
      return {
        ...group,
        items,
      };
    })
    .filter(Boolean) as MergedSidebarGroup[];
}
