import { z } from "zod";
import { RoleEnum } from "./role.schema";

export type SidebarItem = {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  order?: number;
  roles: string[];
  children?: SidebarItem[];
  badge?: {
    label: string;
    variant?: "default" | "destructive" | "outline";
  };
  featureFlag?: string;
  submenuMode?: "inline" | "flyout";
  hidden?: boolean;
};

export const SidebarItemSchema: z.ZodType<SidebarItem> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string(),
    icon: z.string().optional(),
    path: z.string().optional(),
    order: z.number().optional(),
    roles: z.array(RoleEnum),
    children: z.array(SidebarItemSchema).optional(),
    badge: z
      .object({
        label: z.string(),
        variant: z.enum(["default", "destructive", "outline"]).optional(),
      })
      .optional(),
    featureFlag: z.string().optional(),
    submenuMode: z.enum(["inline", "flyout"]).optional(),
    hidden: z.boolean().optional(),
  })
);

export const SidebarGroupDocSchema = z.object({
  id: z.string(),
  label: z.string(),
  order: z.number(),
  roles: z.array(RoleEnum),
  items: z.array(SidebarItemSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SidebarGroupDoc = z.infer<typeof SidebarGroupDocSchema>;
