import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { can, requirementForPath } from "@/lib/auth/permissions";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin-auth")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL("/admin-auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // The profile and MFA lookups don't depend on each other, so run them together.
    const [{ data: profile }, { data: mfa }] = await Promise.all([
      supabase.from("profiles").select("role, status").eq("id", user.id).single(),
      supabase.from("admin_mfa").select("*").eq("admin_id", user.id).single(),
    ]);

    if (!profile || !["super_admin", "admin", "editor"].includes(profile.role) || profile.status !== "active") {
      const loginUrl = new URL("/admin-auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Page access by role. Sections the role cannot use send it back to the dashboard.
    const needs = requirementForPath(pathname);
    if (needs && !can(profile.role, needs.resource, needs.action)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (!pathname.startsWith("/admin/security") && mfa && mfa.mfa_required !== false) {
      const hasEnabledMFA = mfa.totp_enabled || mfa.email_otp_enabled || mfa.passkey_enabled;
      const mfaVerified = request.cookies.get("mfa-verified")?.value === "true";
      if (hasEnabledMFA && !mfaVerified && !pathname.startsWith("/admin-auth/mfa/confirm")) {
        const mfaUrl = new URL("/admin-auth/mfa/confirm", request.url);
        mfaUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(mfaUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
