import { AuthError } from "./auth-error";
import { can, type Action, type Resource } from "./permissions";
import { getProfile } from "./get-profile";
import { getUser } from "./get-user";

/**
 * Guard for admin API routes: the caller must be signed in, active, and their
 * role must allow `action` on `resource`. Returns the auth user and profile.
 */
export async function requirePermission(resource: Resource, action: Action) {
  const user = await getUser();
  if (!user) throw new AuthError(401, "You are not signed in");

  const profile = await getProfile(user.id).catch(() => null);
  if (!profile || profile.status !== "active") {
    throw new AuthError(401, "Your account is not active");
  }

  if (!can(profile.role, resource, action)) {
    throw new AuthError(403, "You do not have permission to do this");
  }

  return { user, profile };
}
