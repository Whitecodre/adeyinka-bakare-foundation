import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { memberSchema } from "@/lib/validations/members.schema";
import { 
  getMemberById, 
  updateMemberById, 
  removeMember 
} from "@/lib/services/members.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET member by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("members", "read");
    const { id } = await params;
    
    const member = await getMemberById(id);
    
    if (!member) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get member error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch member" },
      { status: 500 }
    );
  }
}

// PATCH update member
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("members", "update");
    const { id } = await params;

    const body = await request.json();
    const validatedData = memberSchema.partial().parse(body);

    const member = await updateMemberById(id, validatedData, user.id);

    // Notify admins about member update
    await notifyAdmins({
      title: "Member Updated",
      message: `Member "${member.full_name}" has been updated.`,
      ctaUrl: `/admin/members/${id}`,
      ctaLabel: "View Member",
    });

    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Update member error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update member" },
      { status: 500 }
    );
  }
}

// DELETE member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("members", "delete");
    const { id } = await params;

    // Get member info before deletion for notification
    const member = await getMemberById(id);
    await removeMember(id, user.id);

    // Notify admins about member deletion
    await notifyAdmins({
      title: "Member Deleted",
      message: `Member "${member?.full_name || "Unknown"}" has been deleted.`,
      ctaUrl: "/admin/members",
      ctaLabel: "View Members",
    });

    return NextResponse.json({ success: true, message: "Member deleted" });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Delete member error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete member" },
      { status: 500 }
    );
  }
}
