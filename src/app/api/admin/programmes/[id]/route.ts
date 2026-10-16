import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
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
    const user = await requireAuth();
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
    const user = await requireAuth();
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
    const user = await requireAuth();
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
    console.error("Delete programme error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete programme" },
      { status: 500 }
    );
  }
}
