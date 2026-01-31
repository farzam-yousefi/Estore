// types/sidebar.types.ts

import { AdminRole } from "./Roles";

export type SubmenuMode = "inline" | "flyout" | "DropDown";
export interface SidebarMeta {
  version: string;
  description?: string;
  maxDepth: number;
}

export interface SidebarConfig {
  meta: SidebarMeta;
  roles: AdminRole[];
  groups: SidebarGroup[];
}

//static from sidebar.config
export interface SidebarGroup {
  // id: string;
  title: string;
  type: "collapsable" | "ordinary";
  order: number;
  roles: AdminRole[];
  items: SidebarItem[];
  //  depth :number;
}

//dynamic from db
export interface SidebarGroupDoc extends SidebarGroup {
  createdAt: Date;
  updatedAt: Date;
}

export interface SidebarItem {
  // id: string;
  title: string;
  icon?: string; // lucide icon name
  url?: string; // leaf nodes
  order: number;
  roles: AdminRole[];

  // nesting (max 3 levels enforced logically, not structurally)
  children?: SidebarItem[];

  // advanced / future-proof
  badge?: {
    label: string;
    variant?: "default" | "destructive" | "outline";
  };

  // featureFlag?: string;

  // submenuMode?: SubmenuMode;
  //  type :"leaf"|"non-leaf";
  hidden?: boolean;
}

// unified type for merged groups
export type MergedSidebarGroup = SidebarGroup | SidebarGroupDoc;
