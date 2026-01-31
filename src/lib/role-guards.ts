import { SessionRole, AdminRole } from "@/types/Roles";

export function isAdminRole(role: SessionRole): role is AdminRole {
  return role === "admin" || role === "superAdmin";
}
