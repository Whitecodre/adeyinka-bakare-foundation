import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { contentSchema } from "@/lib/validations/content.schema";
import { getContentById, updateContentById, removeContent } from "@/lib/services/content.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET content by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const content = await getContentById(id);

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error("Get content error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

// PATCH update content
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const body = await request.json();
    const validatedData = contentSchema.partial().parse(body);

    const content = await updateContentById(id, validatedData, user.id);

    // Notify admins about content update
    await notifyAdmins({
      title: "Content Updated",
      message: `Content "${content.title}" has been updated.`,
      ctaUrl: "/admin/contents",
      ctaLabel: "View Contents",
    });

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error("Update content error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update content" },
      { status: 500 }
    );
  }
}

// DELETE content
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Get content info before deletion for notification
    const content = await getContentById(id);
    await removeContent(id, user.id);

    // Notify admins about content deletion
    await notifyAdmins({
      title: "Content Deleted",
      message: `Content "${content?.title || "Unknown"}" has been deleted.`,
      ctaUrl: "/admin/contents",
      ctaLabel: "View Contents",
    });

    return NextResponse.json({ success: true, message: "Content deleted" });
  } catch (error) {
    console.error("Delete content error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete content" },
      { status: 500 }
    );
  }
}
