import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { deleteInvite } from "@/lib/repositories/admin-invites.repository";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("admins", "delete");
    const { id } = await params;
    await deleteInvite(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    const denied = authErrorResponse(err);
    if (denied) return denied;
    return NextResponse.json({ success: false, error: err?.message ?? "Failed" }, { status: 500 });
  }
}
