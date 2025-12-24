"use client";

import { useActionState } from "react";
import Link from "next/link";
import {login, LoginState } from "../lib/actions/auths";
import GoogleLoginButton from "./GoogleLoginButton";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { LogInIcon } from "lucide-react";
import { signIn } from "@/auth";
export default function AdminLoginForm() {
  const initialState: LoginState = {
    email: "",
    errors: {
      email: "",
      password: "",
    },
  };
  const [state, loginAction, isPending] = useActionState(login, initialState);
  const pathName = usePathname();
  return (<div>
    <form action={loginAction} className="space-y-4">
      <div className="w-full">
        <div>
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              defaultValue={state.email}
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            {state?.errors?.email && (
              <p className="error">{state.errors.email}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            {state?.errors?.password && (
              <div className="flex h-8 items-end space-x-1">
                <p className="error">{state.errors.password}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      
      <Button
            disabled={isPending}
            className="mt-4 w-full"
            aria-disabled={isPending}
          >
            {isPending ? "Loading..." : "Login"}
            <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
   

          </form>
        
      
      
        
         
        </div>
      )}
    


