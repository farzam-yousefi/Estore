import { SidebarConfig } from "../types/sidebar.types";

export const sidebarConfig: SidebarConfig = {
  meta: {
    version: "1.0.0",
    description: "Admin dashboard sidebar configuration",
    maxDepth: 5,
  },
  roles: ["superAdmin", "admin"],
  groups: [
    {
      title: "Main",
      order: 1,
      type :"ordinary",
      roles: ["superAdmin", "admin"],
    //  depth :1,
      items: [
        {
          title: "Home",
          icon: "Home",
          url: "/",
          roles: ["superAdmin", "admin"],
          order: 1,
         // type :"leaf"
        },
        {
          title: "Dashboard",
          icon: "LayoutDashboard",
          url: "/admin/dashboard",
          roles: ["superAdmin", "admin"],
          order: 1,
        //  type :"leaf"
        },
      ],
    },
    {
    //  id: "users",
      title: "User Management",
      order: 5,
    //  depth :2,
      type :"collapsable",
      roles: ["superAdmin", "admin"],
      items: [
        {
       //   id: "users-root",
          title: "Users",
          icon: "Users",
          roles: ["superAdmin"],
          order : 1,
      //    type :"non-leaf",
      //    submenuMode :"DropDown",
          children: [
            {
          //    id: "admin-users",
              title: "Admins",
              icon :"ShieldCheck",
              url: "/admin/users/admins",
              roles: ["superAdmin"],
              order :1,
          //    type :"leaf"
            },
            {
          //    id: "customer-users",
              title: "Customers",
              icon :"User",
              order : 2,
              url: "/admin/users/customers",
              roles: ["superAdmin", "admin"],
          //    type :"leaf"
            },
          ],
        },
      ],
    },
    {
    //  id: "settings",
      title: "Settings",
      order: 6,
    //  depth :2,
      type :"collapsable",
      roles: ["superAdmin"],
      items: [
        {
    //      id: "settings-root",
          title: "System Settings",
          icon: "Settings",
          order : 1,
          roles: ["superAdmin"],
      //    submenuMode :"DropDown",
     //     type :"non-leaf",
          children: [
            {
     //         id: "general-settings",
              title: "General",
              
              order :1,
              url: "/admin/settings/general",
              roles: ["superAdmin"],
       //       type :"leaf"
            },
            {
        //      id: "security-settings",
              title: "Security",
              icon : "Shield",
              order : 2,
              url: "/admin/settings/security",
              roles: ["superAdmin"],
         //     type :"leaf"
            },
          ],
        },
      ],
    },
  ],
};
