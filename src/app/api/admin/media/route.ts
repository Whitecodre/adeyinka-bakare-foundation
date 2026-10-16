import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { createNewMedia } from "@/lib/services/media.service";
import { mediaSchema } from "@/lib/validations/media.schema";
import { notifyAdmins } from "@/lib/email/admin-notifications";
import { publicUrlForMedia } from "@/lib/storage/public-url";

// GET all media
export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePermission("media", "read");
    const { getAllMedia } = await import("@/lib/services/media.service");

    const media = await getAllMedia();

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

// POST create media
export async function POST(request: NextRequest) {
  try {
    const { user } = await requirePermission("media", "create");

    const body = await request.json();
    const validatedData = mediaSchema.parse(body);

    const media = await createNewMedia(validatedData, user.id);

    // Notify admins about media upload
    await notifyAdmins({
      title: "Media Uploaded",
      message: `Media file "${validatedData.filename}" has been uploaded.`,
      ctaUrl: "/admin/media",
      ctaLabel: "View Media",
    });

    return NextResponse.json(
      { success: true, data: { ...media, public_url: publicUrlForMedia(media.storage_path) } },
      { status: 201 }
    );
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Create media error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to upload media" },
      { status: 500 }
    );
  }
}
