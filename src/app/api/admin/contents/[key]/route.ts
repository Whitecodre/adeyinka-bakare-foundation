import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { contentSchema } from "@/lib/validations/contents.schema";
import { 
  getContentByKey, 
  updateContentById, 
  removeContent 
} from "@/lib/services/contents.service";

// GET content by key
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const user = await requireAuth();
    const { key } = await params;
    
    const content = await getContentByKey(key);
    
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
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const user = await requireAuth();
    const { key } = await params;
    
    const body = await request.json();
    const validatedData = contentSchema.partial().parse(body);
    
    // First get the content by key to get its ID
    const existingContent = await getContentByKey(key);
    if (!existingContent) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }
    
    const content = await updateContentById(existingContent.id, validatedData, user.id);
    
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
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const user = await requireAuth();
    const { key } = await params;
    
    // First get the content by key to get its ID
    const existingContent = await getContentByKey(key);
    if (!existingContent) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }
    
    await removeContent(existingContent.id, user.id);
    
    return NextResponse.json({ success: true, message: "Content deleted" });
  } catch (error) {
    console.error("Delete content error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete content" },
      { status: 500 }
    );
  }
}
