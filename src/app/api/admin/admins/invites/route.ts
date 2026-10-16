import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { listInvites } from "@/lib/repositories/admin-invites.repository";

export async function GET(_req: NextRequest) {
  try {
    await requirePermission("admins", "read");
    const invites = await listInvites();
    return NextResponse.json({ success: true, data: invites });
  } catch (err: any) {
    const denied = authErrorResponse(err);
    if (denied) return denied;
    return NextResponse.json({ success: false, error: err?.message ?? "Failed" }, { status: err?.message === "Forbidden" ? 403 : 500 });
  }
}
