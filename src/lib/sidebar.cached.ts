//sidebar.cached
import { SidebarGroupDoc } from "@/types/sidebar.types";
import { getCollection } from "./db";

// Cache
let cache: SidebarGroupDoc[] | null = null;

export async function getCachedSidebarGroups(
  forceRefresh = false
): Promise<SidebarGroupDoc[]> {
  if (cache && !forceRefresh) return cache;

  const collection = await getCollection<SidebarGroupDoc>("sidebar_groups");

  // Fetch all documents from MongoDB
  const docs = await collection.find({}).toArray();
 
  cache = docs; // store the array in cache
  return cache;
}
