import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { email, password, fullName } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: "Email, password, and full name are required" },
        { status: 400 }
      );
    }

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // Create profile for the user
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        role: "editor", // Default role for new signups
        status: "active",
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Attempt to clean up the auth user
        await supabase.auth.admin.deleteUser(data.user.id);
        return NextResponse.json(
          { success: false, error: "Failed to create profile" },
          { status: 500 }
        );
      }

      // Initialize MFA settings
      await supabase.from("admin_mfa").insert({
        admin_id: data.user.id,
        totp_enabled: false,
        email_otp_enabled: false,
        passkey_enabled: false,
        mfa_required: false,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        user: data.user,
        session: data.session,
        message: data.session
          ? "Account created successfully"
          : "Account created. Please check your email to confirm your account.",
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create account" },
      { status: 500 }
    );
  }
}
