/**
 * Single source of truth for who can do what in the admin.
 *
 * - editor:      read, create, update (no delete)
 * - admin:       read, create, update, delete
 * - super_admin: everything, plus the site-level sections (footer, social
 *                links, settings) and admin-account management.
 *
 * Enforced in three places: API routes (`requirePermission`), `src/proxy.ts`
 * (page access) and the UI (hidden controls). Only the API routes are real
 * security; the other two are for a clean experience.
 */
export type Role = "super_admin" | "admin" | "editor";
export type Action = "read" | "create" | "update" | "delete";

export const ROLES: readonly Role[] = ["super_admin", "admin", "editor"];

const ALL: readonly Action[] = ["read", "create", "update", "delete"];
const NO_DELETE: readonly Action[] = ["read", "create", "update"];
const NONE: readonly Action[] = [];

type Grant = Record<Role, readonly Action[]>;

const CONTENT: Grant = { super_admin: ALL, admin: ALL, editor: NO_DELETE };
const SUPER_ONLY: Grant = { super_admin: ALL, admin: NONE, editor: NONE };
const ADMIN_UP: Grant = { super_admin: ALL, admin: ALL, editor: NONE };
const EVERYONE_FULL: Grant = { super_admin: ALL, admin: ALL, editor: ALL };
const EVERYONE_READ: Grant = { super_admin: ["read"], admin: ["read"], editor: ["read"] };

export const PERMISSIONS = {
  dashboard: EVERYONE_READ,
  members: CONTENT,
  volunteers: CONTENT,
  beneficiaries: CONTENT,
  programmes: CONTENT,
  testimonials: CONTENT,
  events: CONTENT,
  news: CONTENT,
  media: CONTENT,
  contents: CONTENT,
  notifications: EVERYONE_FULL,
  email: ADMIN_UP,
  footer: SUPER_ONLY,
  socialLinks: SUPER_ONLY,
  settings: SUPER_ONLY,
  admins: SUPER_ONLY,
} as const satisfies Record<string, Grant>;

export type Resource = keyof typeof PERMISSIONS;

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function can(role: string | null | undefined, resource: Resource, action: Action): boolean {
  if (!isRole(role)) return false;
  return PERMISSIONS[resource][role].includes(action);
}

/** Maps /admin/<segment> to a resource, for page and sidebar checks. */
const SEGMENT_TO_RESOURCE: Record<string, Resource> = {
  "": "dashboard",
  members: "members",
  volunteers: "volunteers",
  beneficiaries: "beneficiaries",
  programmes: "programmes",
  testimonials: "testimonials",
  events: "events",
  news: "news",
  media: "media",
  contents: "contents",
  notifications: "notifications",
  email: "email",
  footer: "footer",
  "social-links": "socialLinks",
  settings: "settings",
  admins: "admins",
};

/**
 * Which resource and action a /admin page needs. Returns null for pages that
 * every signed-in admin may open (their own security settings, unknown paths).
 */
export function requirementForPath(pathname: string): { resource: Resource; action: Action } | null {
  const [segment = "", ...rest] = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
  if (segment === "security") return null;
  const resource = SEGMENT_TO_RESOURCE[segment];
  if (!resource) return null;
  const last = rest[rest.length - 1];
  if (last === "new") return { resource, action: "create" };
  if (last === "edit") return { resource, action: "update" };
  return { resource, action: "read" };
}
