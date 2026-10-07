import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { disableTOTP } from "@/lib/services/security.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const result = await disableTOTP(user.id);

    return NextResponse.json({
      success: true,
      data: {
        totpEnabled: result.totp_enabled,
      },
    });
  } catch (error) {
    console.error("TOTP disable error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to disable TOTP" },
      { status: 500 }
    );
  }
}
