import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { mediaSchema } from "@/lib/validations/media.schema";
import { getMediaById, updateMediaById, removeMedia } from "@/lib/services/media.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";
import { publicUrlForMedia } from "@/lib/storage/public-url";

// GET media by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("media", "read");
    const { id } = await params;

    const media = await getMediaById(id);

    if (!media) {
      return NextResponse.json(
        { success: false, error: "Media not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get media error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

// PATCH update media
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("media", "update");
    const { id } = await params;

    const body = await request.json();
    const validatedData = mediaSchema.partial().parse(body);

    const media = await updateMediaById(id, validatedData, user.id);

    // Notify admins about media update
    await notifyAdmins({
      title: "Media Updated",
      message: `Media "${media.filename}" has been updated.`,
      ctaUrl: "/admin/media",
      ctaLabel: "View Media",
    });

    return NextResponse.json({ success: true, data: { ...media, public_url: publicUrlForMedia(media.storage_path) } });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Update media error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update media" },
      { status: 500 }
    );
  }
}

// DELETE media
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("media", "delete");
    const { id } = await params;

    // Get media info before deletion for notification
    const media = await getMediaById(id);
    await removeMedia(id, user.id);

    // Notify admins about media deletion
    await notifyAdmins({
      title: "Media Deleted",
      message: `Media "${media?.filename || "Unknown"}" has been deleted.`,
      ctaUrl: "/admin/media",
      ctaLabel: "View Media",
    });

    return NextResponse.json({ success: true, message: "Media deleted" });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Delete media error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
