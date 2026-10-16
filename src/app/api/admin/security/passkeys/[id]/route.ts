import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { deletePasskey } from "@/lib/services/security.service";
import { sendPasskeyRemovedNotification } from "@/lib/services/security-notifications.service";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const result = await deletePasskey(id);

    // Send email notification if we have the device name
    if (result.deviceName && result.adminId) {
      await sendPasskeyRemovedNotification(result.adminId, result.deviceName);
    }

    return NextResponse.json({
      success: true,
      data: { message: "Passkey deleted successfully" },
    });
  } catch (error) {
    console.error("Passkey delete error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete passkey" },
      { status: 500 }
    );
  }
}
