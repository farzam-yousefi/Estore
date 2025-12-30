// // sidebar.filter.ts
// import { SidebarGroup, SidebarItem } from "../types/sidebar.types";
// import { Role } from "@/lib/adminRoles";
// function filterItemsByRole(items: SidebarItem[], role: Role): SidebarItem[] {
//   return items
//     .filter((item) => item.roles.includes(role) && !item.hidden)
//     .map((item) => {
//       if (!item.children) return item;

//       const filteredChildren = filterItemsByRole(item.children, role);

//       if (filteredChildren.length === 0 && !item.path) {
//         return null;
//       }

//       return {
//         ...item,
//         children: filteredChildren,
//       };
//     })
//     .filter(Boolean) as SidebarItem[];
// }

// export function filterSidebarByRole(
//   groups: SidebarGroup[],
//   role: Role
// ): SidebarGroup[] {
//   return groups
//     .map((group) => {
//       const items = filterItemsByRole(group.items, role);
//       if (items.length === 0) return null;

//       return {
//         ...group,
//         items,
//       };
//     })
//     .filter(Boolean) as SidebarGroup[];
// }


import { SidebarGroup, SidebarItem, MergedSidebarGroup } from "@/types/sidebar.types";
import { Role } from "@/lib/adminRoles";

function filterItemsByRole(items: SidebarItem[], role: Role): SidebarItem[] {
  return items
    .filter((item) => item.roles.includes(role) && !item.hidden)
    .map((item) => {
      if (!item.children) return item;

      const filteredChildren = filterItemsByRole(item.children, role);

      if (filteredChildren.length === 0 && !item.path) {
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
  role: Role
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
