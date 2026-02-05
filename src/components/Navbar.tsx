"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { NavLink } from "./NavLink";
import { logout } from "@/lib/actions/auths";

export function Navbar() {
  const { data: session } = useSession();
  const isAuthUser = !!session?.user;
  const { setTheme } = useTheme();
  return (
    <nav className="p-4 flex justify-between items-center">
      {isAuthUser ? (
        <>
          <div className="flex justify-center items-center">
            <SidebarTrigger />
          </div>
          <div className="flex items-center gap-4">
            <NavLink label="Dashboard" href="/admin/dashboard" />

            <button className="nav-link" onClick={logout}>
              Logout
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src="/images/avatars/female.jpg" />
                  <AvatarFallback>FA</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="h-[1.2rem] w-[1.2rem] mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive" onClick={logout}>
                    <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </nav>
  );
}
