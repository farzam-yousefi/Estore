import { SidebarGroupDoc, SidebarGroup, MergedSidebarGroup } from "@/types/sidebar.types";
import { sidebarConfig } from "@/config/sidebar.config";
import { getCachedSidebarGroups } from "./sidebar.cached";

// Merge static + dynamic groups
export async function getMergedSidebarGroups(): Promise<MergedSidebarGroup[]> {
  // Static groups from sidebar.config.ts
  const staticGroups: SidebarGroup[] = sidebarConfig.groups;
  

  // Dynamic groups from DB cache
  const dynamicGroups: SidebarGroupDoc[] = await getCachedSidebarGroups();
 

  // Merge static + dynamic into unified array
  const mergedGroups: MergedSidebarGroup[] = [
    ...staticGroups,
    ...dynamicGroups,
  ];

  // Sort by order field (ascending)
  mergedGroups.sort((a, b) => a.order - b.order);
  
  return mergedGroups;
}
