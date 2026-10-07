import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    // Check if user has a profile and is active
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        return NextResponse.json(
          { success: false, error: "Profile not found" },
          { status: 403 }
        );
      }

      if (profile.status !== "active") {
        await supabase.auth.signOut();
        return NextResponse.json(
          { success: false, error: "Account is not active" },
          { status: 403 }
        );
      }

      // Check if MFA is required
      const { data: mfaSettings } = await supabase
        .from("admin_mfa")
        .select("*")
        .eq("admin_id", data.user.id)
        .single();

      if (mfaSettings?.mfa_required && mfaSettings?.totp_enabled) {
        return NextResponse.json({
          success: true,
          data: {
            user: data.user,
            profile,
            requiresMFA: true,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to login" },
      { status: 500 }
    );
  }
}
