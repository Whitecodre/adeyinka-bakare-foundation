import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { registerPasskey } from "@/lib/services/security.service";
import { passkeyRegisterSchema } from "@/lib/validations/security.schema";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validatedData = passkeyRegisterSchema.parse(body);

    const result = await registerPasskey(
      user.id,
      validatedData.credential,
      validatedData.device_name
    );

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        credentialId: result.credential_id,
        deviceName: result.device_name,
        createdAt: result.created_at,
      },
    });
  } catch (error) {
    console.error("Passkey register error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to register passkey" },
      { status: 500 }
    );
  }
}
