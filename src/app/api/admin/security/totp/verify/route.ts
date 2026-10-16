import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { verifyTOTP as verifyTOTPService } from "@/lib/services/security.service";
import { totpVerifySchema } from "@/lib/validations/security.schema";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validatedData = totpVerifySchema.parse(body);

    const result = await verifyTOTPService(user.id, validatedData.code);

    return NextResponse.json({
      success: true,
      data: {
        totpEnabled: result.totp_enabled,
      },
    });
  } catch (error) {
    console.error("TOTP verify error:", error);
    if (error instanceof Error && error.message === "Invalid TOTP code") {
      return NextResponse.json(
        { success: false, error: "Invalid TOTP code" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to verify TOTP" },
      { status: 500 }
    );
  }
}
