// // SidebarItem.tsx
// "use client";

// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { resolveIcon } from "@/lib/icon-map";
// import { SidebarItem } from "../types/sidebar.types";
// import { ChevronRight,ChevronDown  } from "lucide-react";
// import { useState ,useEffect } from "react";

// interface Props {
//   item: SidebarItem;
//   depth?: number;
// }

// export function SidebarItemNode({ item, depth = 0 }: Props) {
//   const Icon = resolveIcon(item.icon);
//   const isFlyout = item.submenuMode === "flyout";
//   // const padding = `pl-${4 + depth * 4}`;
//     const [isOpen, setIsOpen] = useState(false);
//   // const toggleOpen = () => setIsOpen((prev) => !prev);
//  // Close submenu if clicked outside
//   useEffect(() => {
//     if (!isFlyout) return;
//     const handleClickOutside = (e: MouseEvent) => {
//       const target = e.target as HTMLElement;
//       if (!target.closest(`#sidebar-item-${item.id}`)) {
//         setIsOpen(false);
//       }
//     };
//        document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [isFlyout, item.id]);
//   const toggleOpen = () => setIsOpen((prev) => !prev);


//   // ---------- FLYOUT MODE ----------
//   if (item.children?.length && isFlyout) {
//     return (
//       <div id={`sidebar-item-${item.id}`} className="relative group">
//         <div
//           className={cn(
//             "flex items-center gap-2 px-4 py-2 text-sm cursor-pointer rounded-md",
//             "hover:bg-muted"
//           )}
//                     onClick={toggleOpen} // toggle submenu open/close

//         >
//           <div className="flex items-center gap-2">
//             {Icon && <Icon className="h-4 w-4" />}
//             <span>{item.label}</span>
//           </div>
//           {/* ➜ indicator */}
//                 <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-90")}/>

//           {/* <ChevronRight className="h-4 w-4 text-muted-foreground" /> */}
//         </div>

//         {/* Right-side dropdown */}
//         <div
//           className={cn(
//     //         "absolute top-0 left-full ml-2",
//     // "min-w-48 max-w-xs",
//     // "overflow-hidden"
//             "absolute top-0 left-full ml-2 hidden group-hover:block",
//             "min-w-50 rounded-md border bg-background shadow-lg",
//             isOpen && "block" // click locks open
//           )}
//         >
//           {item.children.map((child) => (
//             <Link
//               key={child.id}
//               href={child.path!}
//               className="block px-4 py-2 text-sm hover:bg-muted"
//             >
//               {child.label}
//             </Link>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // ---------- INLINE MODE ----------
//   if (item.children?.length) {
//     return (
//       <div className="space-y-1">
//         <div
//           className={cn(
//             "flex items-center gap-2 px-4 py-2 text-sm font-medium",
//             "text-muted-foreground"
//           )}
//         >
//           {Icon && <Icon className="h-4 w-4" />}
//           {item.label}
//         </div>

//         <div className="space-y-1 pl-4">
//           {item.children.map((child) => (
//             <SidebarItemNode key={child.id} item={child} depth={depth + 1} />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // ---------- LEAF ----------
//   return (
//     <Link
//       href={item.path!}
//       className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-muted"
//     >
//       {Icon && <Icon className="h-4 w-4" />}
//       {item.label}
//     </Link>
//   );
// }






//******************************************************
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { resolveIcon } from "@/lib/icon-map";
import { SidebarItem } from "@/types/sidebar.types";
import { cn } from "@/lib/utils";

interface Props {
  item: SidebarItem;
    depth?: number;
}

export function SidebarItemNode({ item ,depth = 0}: Props) {
  const Icon = resolveIcon(item.icon);
  const isFlyout = item.submenuMode === "flyout";
  const [open, setOpen] = useState(false);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [open]);

  // ---------- FLYOUT MODE ----------
  if (item.children?.length && isFlyout) {
    return (
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-md px-4 py-2 text-sm",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            <span className="group-data-[collapsible=icon]:hidden">
              {item.label}
            </span>
          </div>

          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              open && "rotate-90"
            )}
          />
        </button>

        {/* flyout panel */}
        {open && (
          <div
            className={cn(
              "absolute top-0 left-full z-50 ml-2 min-w-48 rounded-md border",
              "bg-sidebar text-sidebar-foreground shadow-lg"
            )}
          >
            {item.children.map((child) => (
              <Link
                key={child.id}
                href={child.path!}
                className="block px-4 py-2 text-sm hover:bg-sidebar-accent"
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
 // ---------- INLINE MODE ----------
  if (item.children?.length) {
    return (
      <div className="space-y-1">
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium",
            "text-muted-foreground"
          )}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {item.label}
        </div>

        <div className="space-y-1 pl-4">
          {item.children.map((child) => (
            <SidebarItemNode key={child.id} item={child} depth={depth + 1} />
          ))}
        </div>
      </div>
    );
  }

  // ---------- LEAF ----------
  return (
    <Link
      href={item.path!}
      className="flex items-center gap-2 rounded-md px-4 py-2 text-sm hover:bg-sidebar-accent"
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span className="group-data-[collapsible=icon]:hidden">
        {item.label}
      </span>
    </Link>
  );

}
