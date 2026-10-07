import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { mediaSchema } from "@/lib/validations/media.schema";
import { 
  getAllMedia, 
  getMediaById, 
  createNewMedia, 
  updateMediaById, 
  removeMedia 
} from "@/lib/services/media.service";

// GET all media
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    
    const media = await getAllMedia();
    
    // Filter by type if provided
    const filtered = type 
      ? media.filter(m => m.type === type)
      : media;
    
    return NextResponse.json({ success: true, data: filtered });
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
    
    const mediaItem = await createNewMedia(validatedData, user.id);
    
    return NextResponse.json(
      { success: true, data: mediaItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create media error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create media" },
      { status: 500 }
    );
  }
}
