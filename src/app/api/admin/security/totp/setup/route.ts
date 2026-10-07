import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { setupTOTP } from "@/lib/services/security.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const result = await setupTOTP(user.id);

    return NextResponse.json({
      success: true,
      data: {
        qrCodeUrl: result.qrCodeUrl,
        totpEnabled: result.totp_enabled,
      },
    });
  } catch (error) {
    console.error("TOTP setup error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to setup TOTP" },
      { status: 500 }
    );
  }
}
