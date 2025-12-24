// src/lib/actions/auths.ts
"use server";

import bcrypt from "bcrypt";
import { auth, signIn, signOut } from "@/auth";
import { getCollection } from "@/lib/db";
import { DbUser, userDTO } from "@/lib/user";
import { LoginFormSchema, RegisterFormSchema } from "@/lib/rules";

export interface RegisterState {
  errors: {
    email: string;
    password: string[];
    confirmPassword: string;
  };
  email: string;
}

export interface LoginState {
  errors: {
    email: string;
    password: string;
  };
  email: string;
}

// ======================
// REGISTER (USER ONLY)
// ======================
export async function register(
  state: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = RegisterFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      errors: {
        email: parsed.error.flatten().fieldErrors.email?.[0] ?? "",
        password: parsed.error.flatten().fieldErrors.password ?? [],
        confirmPassword:
          parsed.error.flatten().fieldErrors.confirmPassword?.[0] ?? "",
      },
      email: (formData.get("email") as string) || "",
    };
  }

  const { email, password } = parsed.data;

  const users = await getCollection<DbUser>("users");
  console.log("+++++++++++++++++++++usersss+++++");
  console.log(users);
  if (!users) throw new Error("DB error");

  const existing = await users.findOne({ email });
  if (existing) {
    return {
      errors: {
        email: "Email already exists",
        password: [],
        confirmPassword: "",
      },
      email,
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await users.insertOne({
    email,
    passwordHash,
    role: "user",
    provider: "credentials",
    isActive: true,
    createdAt: new Date(),
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });

  return { errors: { email: "", password: [], confirmPassword: "" }, email };
}

// ======================
// LOGIN (USER + ADMIN)
// ======================
export async function login(
  state: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: {
        email: parsed.error.flatten().fieldErrors.email?.[0] ?? "",
        password: parsed.error.flatten().fieldErrors.password?.[0] ?? "",
      },
      email: "",
    };
  }

  const { email, password } = parsed.data;

  const users = await getCollection<DbUser>("users");
  const user = await users.findOne({ email, provider: "credentials" });

  if (!user || !user.passwordHash) {
    return {
      errors: { email: "Invalid credentials", password: "" },
      email,
    };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return {
      errors: { email: "", password: "Invalid password" },
      email,
    };
  }

  const callbackUrl = user.role === "user" ? "/dashboard" : "/admin/dashboard";

  await signIn("credentials", {
    email,
    password,
    redirectTo: callbackUrl,
  });

  return { errors: { email: "", password: "" }, email };
}

// ======================
// LOGOUT
// ======================
export async function logout() {
  const session = await auth();
  const redirectTo =
    session?.user?.role === "admin" || session?.user?.role === "superAdmin"
      ? "/admin"
      : "/";
  await signOut({ redirectTo });
}



