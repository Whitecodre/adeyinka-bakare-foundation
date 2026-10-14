import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/require-role";
import { deleteInvite } from "@/lib/repositories/admin-invites.repository";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["super_admin"]);
    const { id } = await params;
    await deleteInvite(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? "Failed" }, { status: 500 });
  }
}
