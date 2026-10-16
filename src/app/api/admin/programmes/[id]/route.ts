import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { programmeSchema } from "@/lib/validations/programmes.schema";
import {
  getProgrammeById,
  updateProgrammeById,
  removeProgramme
} from "@/lib/services/programmes.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET programme by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("programmes", "read");
    const { id } = await params;
    
    const programme = await getProgrammeById(id);
    
    if (!programme) {
      return NextResponse.json(
        { success: false, error: "Programme not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: programme });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get programme error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch programme" },
      { status: 500 }
    );
  }
}

// PATCH update programme
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("programmes", "update");
    const { id } = await params;

    const body = await request.json();
    const validatedData = programmeSchema.partial().parse(body);

    const programme = await updateProgrammeById(id, validatedData, user.id);

    // Notify admins about programme update
    await notifyAdmins({
      title: "Programme Updated",
      message: `Programme "${programme.title}" has been updated.`,
      ctaUrl: `/admin/programmes/${id}`,
      ctaLabel: "View Programme",
    });

    return NextResponse.json({ success: true, data: programme });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Update programme error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update programme" },
      { status: 500 }
    );
  }
}

// DELETE programme
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("programmes", "delete");
    const { id } = await params;

    // Get programme info before deletion for notification
    const programme = await getProgrammeById(id);
    await removeProgramme(id, user.id);

    // Notify admins about programme deletion
    await notifyAdmins({
      title: "Programme Deleted",
      message: `Programme "${programme?.title || "Unknown"}" has been deleted.`,
      ctaUrl: "/admin/programmes",
      ctaLabel: "View Programmes",
    });

    return NextResponse.json({ success: true, message: "Programme deleted" });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Delete programme error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete programme" },
      { status: 500 }
    );
  }
}
