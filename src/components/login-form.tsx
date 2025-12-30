"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, LoginState } from "../lib/actions/auths";
import GoogleLoginButton from "./GoogleLoginButton";
import { AtSymbolIcon, ExclamationCircleIcon, KeyIcon } from "@heroicons/react/24/outline";

import { LogInIcon } from "lucide-react";

export default function LoginForm() {
  const initialState: LoginState = {
    email: "",
    errors: {
      email: "",
      password: "",
      total:""
    },
  };
  const [state, loginAction, isPending] = useActionState(login, initialState);

  return (
    <div>
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
              <div className="flex items-center justify-center">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  defaultValue={state.email}
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3  h-4.5 w-4.5  text-gray-500 peer-focus:text-gray-900" />
              </div>
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
              <div className="flex items-center justify-center">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                />
                <KeyIcon className="pointer-events-none absolute left-3  h-4.5 w-4.5  text-gray-500 peer-focus:text-gray-900" />
              </div>
              {state?.errors?.password && (
                <div className="flex h-8 items-end space-x-1">
                  <p className="error">{state.errors.password}</p>
                </div>
              )}
            </div>
          </div>
        </div>
<div className="flex h-4 items-end space-x-1">
          {state.errors.total && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{state.errors.total}</p>
            </>
          )}
        </div>
        <div className="flex flex-col items-center mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <button
              disabled={isPending}
              className="btn-primary flex items-center gap-2"
            >
              <LogInIcon className="mr-2 h-4 w-4" />
              {isPending ? "Loading..." : "Login"}
            </button>

            <Link href="/register" className="text-link whitespace-nowrap">
              or register here
            </Link>
          </div>
        </div>
      </form>

      <div className="flex flex-row items-center justify-center">
        <GoogleLoginButton />
      </div>
      
    </div>
  );
}
