import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { mediaSchema } from "@/lib/validations/media.schema";
import { 
  getMediaById, 
  updateMediaById, 
  removeMedia 
} from "@/lib/services/media.service";

// GET media by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const mediaItem = await getMediaById(id);
    
    if (!mediaItem) {
      return NextResponse.json(
        { success: false, error: "Media not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: mediaItem });
  } catch (error) {
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
    const user = await requireAuth();
    const { id } = await params;
    
    const body = await request.json();
    const validatedData = mediaSchema.partial().parse(body);
    
    const mediaItem = await updateMediaById(id, validatedData, user.id);
    
    return NextResponse.json({ success: true, data: mediaItem });
  } catch (error) {
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
    const user = await requireAuth();
    const { id } = await params;
    
    await removeMedia(id, user.id);
    
    return NextResponse.json({ success: true, message: "Media deleted" });
  } catch (error) {
    console.error("Delete media error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
