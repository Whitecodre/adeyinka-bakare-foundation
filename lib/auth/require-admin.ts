import { requireAuth } from "./require-auth";
import { getProfile } from "./get-profile";

export async function requireAdmin() {
  const user = await requireAuth();
  const profile = await getProfile(user.id);

  if (!profile || profile.status !== "active") {
    throw new Error("Unauthorized");
  }

  return { user, profile };
}
