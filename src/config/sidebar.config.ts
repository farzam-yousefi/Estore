import { SidebarConfig } from "../types/sidebar.types";

export const sidebarConfig: SidebarConfig = {
  meta: {
    version: "1.0.0",
    description: "Admin dashboard sidebar configuration",
    maxDepth: 3,
  },
  roles: ["superAdmin", "admin"],
  groups: [
    {
      id: "main",
      label: "Main",
      icon :"Home",
      order: 1,
      roles: ["superAdmin", "admin"],
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: "LayoutDashboard",
          path: "/admin/dashboard",
          roles: ["superAdmin", "admin"],
          order: 1,
        },
      ],
    },
    {
      id: "users",
      label: "User Management",
      icon : "Users",
      order: 4,
      roles: ["superAdmin", "admin"],
      items: [
        {
          id: "users-root",
          label: "Users",
          icon: "Users",
          roles: ["superAdmin"],
          children: [
            {
              id: "admin-users",
              label: "Admins",
              icon :"ShieldCheck",
              path: "/admin/users/admins",
              roles: ["superAdmin"],
            },
            {
              id: "customer-users",
              label: "Customers",
              icon :"User",
              path: "/admin/users/customers",
              roles: ["superAdmin", "admin"],
            },
          ],
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon :"Settings",
      order: 5,
      roles: ["superAdmin"],
      items: [
        {
          id: "settings-root",
          label: "System Settings",
          icon: "Settings",
          roles: ["superAdmin"],
          submenuMode: "flyout",
          children: [
            {
              id: "general-settings",
              label: "General",
              icon :"Sliders",
              path: "/admin/settings/general",
              roles: ["superAdmin"],
            },
            {
              id: "security-settings",
              label: "Security",
              icon : "Sliders",
              path: "/admin/settings/security",
              roles: ["superAdmin"],
            },
          ],
        },
      ],
    },
  ],
};
