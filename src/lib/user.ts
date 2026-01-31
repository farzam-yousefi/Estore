
//lib/user.ts
import { ObjectId } from "mongodb";

export type DbUser = {
  _id?: ObjectId;
  email: string;
  passwordHash?: string
  role: "superAdmin" | "admin" | "user";
  provider: "credentials" | "google";
  isActive: boolean;
  createdAt: Date;
};

export interface userDTO{
  email: string;
  passwordHash?: string
   role: "superAdmin" | "admin" | "user"|"guest";
  provider: "credentials" | "google";
  isActive: boolean;
}
