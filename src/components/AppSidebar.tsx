"use client";

import * as React from "react";

import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Home,
  Package,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MergedSidebarGroup, SidebarItem } from "@/types/sidebar.types";
import { group } from "console";
import { resolveIcon } from "@/lib/icon-map";
import { SidebarHeaderLogo } from "./SidebarHeaderLogo";

// type MenuItem2 = {
//   title: string
//   url: string
//   icon?: React.ComponentType
//   children?: MenuItem2[]
// }

// Menu items.
// const items: MenuItem2[] = [
//   {
//     title: 'Home',
//     url: '#',
//     icon: Home,
//   },
//   {
//     title: 'Catalog',
//     url: '#',
//     icon: Package,
//     children: [
//       {
//         title: 'Product',
//         icon: Package,
//         url: '#',
//         children: [
//           {
//             title: 'All Products',
//             url: '#',
//           },
//           {
//             title: 'Add Product',
//             url: '#',
//           },
//         ],
//       },
//       {
//         title: 'Category',
//         url: '#',
//       },
//     ],
//   },
//   {
//     title: 'Orders',
//     url: '#',
//     icon: Calendar,
//     children: [
//       {
//         title: 'New Order',
//         url: '#',
//       },
//       {
//         title: 'Order History',
//         url: '#',
//         children: [
//           {
//             title: 'Last 30 Days',
//             url: '#',
//             children: [
//               {
//                 title: 'Level 3 Item',
//                 url: '#',
//               },
//               {
//                 title: 'Older',
//                 url: '#',
//                 children: [
//                   {
//                     title: 'Level 4 Item',
//                     url: '#',
//                   },
//                   {
//                     title: 'Older',
//                     url: '#',
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             title: 'Older',
//             url: '#',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     title: 'Search',
//     url: '#',
//     icon: Search,
//   },
//   {
//     title: 'Settings',
//     url: '#',
//     icon: Settings,
//   },
// ]

function renderIconOrPlaceholder(item: SidebarItem, showPlaceholder: boolean) {
  if (item.icon) {
    const Icon = resolveIcon(item.icon);
    return <Icon />;
  }

  if (showPlaceholder) {
    return <span className="inline-flex size-4 shrink-0" aria-hidden />;
  }

  return null;
}

function renderDropdownItems(itemsList: SidebarItem[]) {
  const hasIcons = itemsList.some((item) => item.icon);

  return itemsList.map((item) =>
    item.children?.length ? (
      <DropdownMenuSub key={item.title}>
        <DropdownMenuSubTrigger>
          {renderIconOrPlaceholder(item, hasIcons)}
          <span>{item.title}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          {renderDropdownItems(item.children)}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    ) : (
      <DropdownMenuItem key={item.title} asChild>
        <a href={item.url}>
          {renderIconOrPlaceholder(item, hasIcons)}
          <span>{item.title}</span>
        </a>
      </DropdownMenuItem>
    )
  );
}

function renderSidebarSubItems(itemsList: SidebarItem[]) {
  const hasIcons = itemsList.some((item) => item.icon);

  return itemsList.map((item) =>
    item.children?.length ? (
      <Collapsible key={item.title} className="group/sub-collapsible">
        <SidebarMenuSubItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton asChild>
              <button type="button">
                {renderIconOrPlaceholder(item, hasIcons)}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/sub-collapsible:rotate-90" />
              </button>
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub className="ml-3">
              {renderSidebarSubItems(item.children)}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuSubItem>
      </Collapsible>
    ) : (
      <SidebarMenuSubItem key={item.title}>
        <SidebarMenuSubButton asChild>
          <a href={item.url}>
            {renderIconOrPlaceholder(item, hasIcons)}
            <span>{item.title}</span>
          </a>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  );
}

function SidebarMenuItemWithChildren({
  item,
  isOpen,
  onOpenChange,
}: {
  item: SidebarItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const Icon = resolveIcon(item.icon);
  const { state, isMobile } = useSidebar();
  const [open, setOpen] = React.useState(false);
  const closeTimeoutRef = React.useRef<number | null>(null);
  const isCollapsed = state === "collapsed" && !isMobile;
  const enableDropdown = isCollapsed || !isOpen;

  const clearCloseTimeout = React.useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = React.useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 100);
  }, [clearCloseTimeout]);

  React.useEffect(() => {
    return () => clearCloseTimeout();
  }, [clearCloseTimeout]);

  React.useEffect(() => {
    if (!enableDropdown && open) {
      setOpen(false);
    }
  }, [enableDropdown, open]);

  const handleMouseEnter = () => {
    if (!enableDropdown) {
      return;
    }
    clearCloseTimeout();
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (!enableDropdown) {
      return;
    }
    scheduleClose();
  };

  if (isCollapsed) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <SidebarMenuItem>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* {item.icon && <item.icon />} */}
              <Icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={8}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {item.children?.length ? renderDropdownItems(item.children) : null}
          </DropdownMenuContent>
        </SidebarMenuItem>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <Collapsible
        open={isOpen}
        onOpenChange={onOpenChange}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* {item.icon && <item.icon />} */}
                <Icon />
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          </CollapsibleTrigger>
          {enableDropdown ? (
            <DropdownMenuContent
              side="right"
              align="start"
              sideOffset={8}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {item.children?.length
                ? renderDropdownItems(item.children)
                : null}
            </DropdownMenuContent>
          ) : null}
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children?.length
                ? renderSidebarSubItems(item.children)
                : null}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </DropdownMenu>
  );
}

export function AppSidebar({ groups }: { groups: MergedSidebarGroup[] }) {
  const [openItemTitle, setOpenItemTitle] = React.useState<string | null>(null);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarHeaderLogo />
      </SidebarHeader>

      <SidebarSeparator className="w-[90%]! m-auto" />

      <SidebarContent>
        {groups.map((group) =>
          group.type === "collapsable" ? (
            <Collapsible key={group.title} defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger>
                    <span>{group.title}</span>
                    <ChevronDown className="ml-1 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => {
                        const Icon = resolveIcon(item.icon);
                        return (
                          <div key={item.title}>
                            {item.children ? (
                              <SidebarMenuItemWithChildren
                                item={item}
                                isOpen={openItemTitle === item.title}
                                onOpenChange={(nextOpen) => {
                                  setOpenItemTitle(
                                    nextOpen ? item.title : null
                                  );
                                }}
                              />
                            ) : (
                              <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                  <a href={item.url}>
                                    <Icon />
                                    <span>{item.title}</span>
                                  </a>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            )}
                          </div>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ) : (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const Icon = resolveIcon(item.icon);
                    return (
                      <div key={item.title}>
                        {item.children ? (
                          <SidebarMenuItemWithChildren
                            item={item}
                            isOpen={openItemTitle === item.title}
                            onOpenChange={(nextOpen) => {
                              setOpenItemTitle(nextOpen ? item.title : null);
                            }}
                          />
                        ) : (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <a href={item.url}>
                                <Icon />
                                <span>{item.title}</span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )}
                      </div>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        )}
      </SidebarContent>
    </Sidebar>
  );
}
