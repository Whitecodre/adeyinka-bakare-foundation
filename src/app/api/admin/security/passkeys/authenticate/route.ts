import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { authenticatePasskey } from "@/lib/services/security.service";
import { passkeyAuthenticateSchema } from "@/lib/validations/security.schema";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validatedData = passkeyAuthenticateSchema.parse(body);

    const result = await authenticatePasskey(validatedData.credential);

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        credentialId: result.credential_id,
        deviceName: result.device_name,
        lastUsedAt: result.last_used_at,
      },
    });
  } catch (error) {
    console.error("Passkey authenticate error:", error);
    if (error instanceof Error && error.message === "Passkey not found") {
      return NextResponse.json(
        { success: false, error: "Passkey not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to authenticate with passkey" },
      { status: 500 }
    );
  }
}
