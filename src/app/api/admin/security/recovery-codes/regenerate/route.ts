import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { regenerateRecoveryCodes } from "@/lib/services/security.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const codes = await regenerateRecoveryCodes(user.id);

    return NextResponse.json({
      success: true,
      data: {
        codes,
        message: "Recovery codes regenerated. Save them securely - they will not be shown again.",
      },
    });
  } catch (error) {
    console.error("Recovery codes regenerate error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to regenerate recovery codes" },
      { status: 500 }
    );
  }
}
