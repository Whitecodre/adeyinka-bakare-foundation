import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { socialLinkSchema } from "@/lib/validations/social-links.schema";
import { 
  getSocialLinkById, 
  updateSocialLinkById, 
  removeSocialLink 
} from "@/lib/services/social-links.service";

// GET social link by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const link = await getSocialLinkById(id);
    
    if (!link) {
      return NextResponse.json(
        { success: false, error: "Social link not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error("Get social link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch social link" },
      { status: 500 }
    );
  }
}

// PATCH update social link
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const body = await request.json();
    const validatedData = socialLinkSchema.partial().parse(body);
    
    const link = await updateSocialLinkById(id, validatedData, user.id);
    
    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error("Update social link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update social link" },
      { status: 500 }
    );
  }
}

// DELETE social link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    await removeSocialLink(id, user.id);
    
    return NextResponse.json({ success: true, message: "Social link deleted" });
  } catch (error) {
    console.error("Delete social link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete social link" },
      { status: 500 }
    );
  }
}
