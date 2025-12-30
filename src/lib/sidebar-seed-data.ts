import { SidebarGroupDoc } from "@/types/sidebar.types";

export const sidebarSeedData: SidebarGroupDoc[] = [
  {
    id: "catalog",
    label: "Catalog",
    icon : "Archive",
    order: 2,
    roles: ["superAdmin", "admin"],
    items: [
      {
        id: "products",
        label: "Products",
        icon: "Package",
        roles: ["superAdmin", "admin"],
        children: [
          {
            id: "product-list",
            label: "All Products",
            icon : "List",
            path: "/admin/products",
            roles: ["superAdmin", "admin"],
            order: 1,
          },
          {
            id: "product-create",
            label: "Create Product",
            icon :"PlusCircle",
            path: "/admin/products/create",
            roles: ["superAdmin","admin"],
            order: 2,
          },
          {
            id: "product-categories",
            label: "Categories",
            icon: "FolderTree",
            roles: ["superAdmin", "admin"],
            order: 3,
            submenuMode: "flyout",
            children: [
              {
                id: "category-list",
                label: "All Categories",
                icon :"List",
                path: "/admin/categories",
                roles: ["superAdmin", "admin"],
                order: 1,
              },
              {
                id: "category-create",
                label: "Create Category",
                icon :"PlusCircle",
                path: "/admin/categories/create",
                roles: ["superAdmin","admin"],
                order: 2,
              },
            ],
          },
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "orders",
    label: "Invoices",
    icon:"Receipt",
    order: 3,
    roles: ["superAdmin", "admin"],
    items: [
      {
        id: "orders-root",
        label: "Orders",
        icon: "ShoppingCart",
        roles: ["superAdmin", "admin"],
        children: [
          {
            id: "order-list",
            label: "All Orders",
            icon :"List",
            path: "/admin/orders",
            roles: ["superAdmin", "admin"],
          },
          {
            id: "order-returns",
            label: "Returns",
            icon :"ArrowLeftRight",
            path: "/admin/orders/returns",
            roles: ["superAdmin","admin"],
          },
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
