"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
export default function GoogleLoginButton() {
  const [isPending, setIsPending] = useState(false);
  const handleGoogleLogin = async () => {
    setIsPending(true); // start loading
    signIn("google", { callbackUrl: "/dashboard" });
  };
  return (
    <div className="w-full flex justify-center">
      <Button
        variant="outline"
        className="bg-blend-color-dodge"
        onClick={handleGoogleLogin}
        disabled={isPending}
      >
        <Image src="/GoogleIcon.svg" width={20} height={20} alt="Google Icon" />
        {isPending ? "Loading..." : "Continue with Google"}
      </Button>
    </div>
  );
}
