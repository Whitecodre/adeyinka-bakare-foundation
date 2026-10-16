import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/require-role";
import { listInvites } from "@/lib/repositories/admin-invites.repository";

export async function GET(_req: NextRequest) {
  try {
    await requireRole(["super_admin"]);
    const invites = await listInvites();
    return NextResponse.json({ success: true, data: invites });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? "Failed" }, { status: err?.message === "Forbidden" ? 403 : 500 });
  }
}
