import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public access to admin auth pages
  if (pathname.startsWith("/admin-auth")) {
    return NextResponse.next();
  }

  // Check if trying to access admin routes
  if (pathname.startsWith("/admin")) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // If no session, redirect to admin login
    if (!session) {
      const loginUrl = new URL("/admin-auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has admin role in profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", session.user.id)
      .single();

    // If no profile or not an admin role, redirect to admin login
    if (!profile || 
        !["super_admin", "admin", "editor"].includes(profile.role) ||
        profile.status !== "active") {
      const loginUrl = new URL("/admin-auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check MFA requirement
    const { data: mfa } = await supabase
      .from("admin_mfa")
      .select("*")
      .eq("admin_id", session.user.id)
      .single();

    // If MFA is required and not yet verified, redirect to MFA confirm
    // Skip MFA check for MFA-related pages to avoid redirect loop
    if (!pathname.startsWith("/admin/security") && mfa && mfa.mfa_required !== false) {
      const hasEnabledMFA = mfa.totp_enabled || mfa.email_otp_enabled || mfa.passkey_enabled;

      // Check if MFA is verified in session (cookie would be set after successful verification)
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
  matcher: [
    "/admin/:path*",
  ],
};
