import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { generateRecoveryCodes } from "@/lib/services/security.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const codes = await generateRecoveryCodes(user.id);

    return NextResponse.json({
      success: true,
      data: {
        codes,
        message: "Recovery codes generated. Save them securely - they will not be shown again.",
      },
    });
  } catch (error) {
    console.error("Recovery codes generate error:", error);
    if (error instanceof Error && error.message === "Recovery codes already exist. Use regenerate instead.") {
      return NextResponse.json(
        { success: false, error: "Recovery codes already exist. Use regenerate instead." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to generate recovery codes" },
      { status: 500 }
    );
  }
}
