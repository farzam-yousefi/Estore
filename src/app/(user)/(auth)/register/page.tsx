import RegisterForm from "@/components/register-form";
import { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Register",
};
export default function RegisterPage() {
  return (
    <div className="container w-1/2">
      <h1 className="title">Register</h1>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
