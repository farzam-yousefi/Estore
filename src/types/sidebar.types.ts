// types/sidebar.types.ts

import { Role } from "@/lib/adminRoles";

export type SubmenuMode = "inline" | "flyout";
export interface SidebarMeta {
  version: string;
  description?: string;
  maxDepth: number;
}

export interface SidebarConfig {
  meta: SidebarMeta;
  roles: Role[];
  groups: SidebarGroup[];
}

//static from sidebar.config
export interface SidebarGroup {
  id: string;
  label: string;
  icon : string;
  order: number;
  roles: Role[];
  items: SidebarItem[];
}

//dynamic from db
export interface SidebarGroupDoc {
  id: string;
  label: string;
  icon :string;
  order: number;
  roles: Role[];
  items: SidebarItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;              // lucide icon name
  path?: string;              // leaf nodes
  order?: number;
  roles: Role[];

  // nesting (max 3 levels enforced logically, not structurally)
  children?: SidebarItem[];

  // advanced / future-proof
  badge?: {
    label: string;
    variant?: "default" | "destructive" | "outline";
  };

  featureFlag?: string;
 
  submenuMode?: SubmenuMode;

  hidden?: boolean;
}

// unified type for merged groups
export type MergedSidebarGroup = SidebarGroup | SidebarGroupDoc;

