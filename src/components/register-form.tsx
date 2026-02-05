"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register, RegisterState } from "../lib/actions/auths";

export default function RegisterForm() {
  const initialState: RegisterState = {
    email: "",
    errors: {
      email: "",
      password: [],
      confirmPassword: "",
    },
  };
  const [state, registerAction, isPending] = useActionState(
    register,
    initialState,
  );

  return (
    <form action={registerAction} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input type="text" name="email" defaultValue={state?.email} />
        {state?.errors?.email && <p className="error">{state.errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" />
        {(state?.errors?.password).length > 0 && (
          <div className="error">
            <p>Password must:</p>
            <ul className="list-disc list-inside ml-4">
              {state.errors.password.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" name="confirmPassword" />
        {state?.errors?.confirmPassword &&
          !(state?.errors?.password.length > 0) && (
            <p className="error">{state.errors.confirmPassword}</p>
          )}
      </div>

      <div className="flex items-end gap-4">
        <button disabled={isPending} className="btn-primary">
          {isPending ? "Loading..." : "Register"}
        </button>

        <Link href="/login" className="text-link">
          or login here
        </Link>
      </div>
    </form>
  );
}
