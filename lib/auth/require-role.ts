import { requireAdmin } from "./require-admin";

export async function requireRole(roles: string[]) {
  const { user, profile } = await requireAdmin();

  if (!roles.includes(profile.role)) {
    throw new Error("Forbidden");
  }

  return { user, profile };
}
