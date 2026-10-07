import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { deletePasskey } from "@/lib/services/security.service";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    await deletePasskey(id);

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
