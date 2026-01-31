import { auth } from "@/auth";
import Image from "next/image";

import { logout } from "@/lib/actions/auths";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut, Settings, User } from "lucide-react";
import { NavLink } from "./NavLink";
import Link from "next/link";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";

export default async function Navigation() {
  const session = await auth();
   console.log("               session");
    console.log(session);
  const isAuthUser = !!session?.user;
  
  const role=(isAuthUser) ? session?.user?.role : "guest";

  // const token = await getToken({
  //          req:NextURL,
  //         secret: process.env.NEXTAUTH_SECRET,
  //       });
  //       const role = token?.role || "";
  console.log(isAuthUser);
  console.log (role);
  return (
    <nav>
      <div className="flex">
        <Image
          src="/logo.webp"
          alt="logo"
          width={30}
          height={30}
          className="rounded-sm"
        />
        <NavLink label="Home" href="/" />
        <Link href="/"></Link>
      </div>

    {/* //  { (isAuthUser) ? ( */}
              { ((isAuthUser)&&(role==="user")) ? (

        <div className="flex items-center">
          <NavLink label="cart" href="/cart" iconName="ShoppingBasketIcon" />

          <NavLink label="Dashboard" href="/dashboard" />
          <button className="nav-link" onClick={logout}>
            Logout
          </button>
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
                <DropdownMenuItem variant="destructive">
                  <LogOut
                    onClick={logout}
                    className="h-[1.2rem] w-[1.2rem] mr-2"
                  />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div>
          <NavLink label="Register" href="/register" />
          <NavLink label="Login" href="/login" />
        </div>
      )}
    </nav>
  );
}
