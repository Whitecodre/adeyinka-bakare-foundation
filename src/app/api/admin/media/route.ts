import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createNewMedia } from "@/lib/services/media.service";
import { mediaSchema } from "@/lib/validations/media.schema";
import { notifyAdmins } from "@/lib/email/admin-notifications";
import { publicUrlForMedia } from "@/lib/storage/public-url";

// GET all media
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { getAllMedia } = await import("@/lib/services/media.service");

    const media = await getAllMedia();

    return NextResponse.json({ success: true, data: media });
  } catch (error) {
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
    const user = await requireAuth();

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
    console.error("Create media error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to upload media" },
      { status: 500 }
    );
  }
}
