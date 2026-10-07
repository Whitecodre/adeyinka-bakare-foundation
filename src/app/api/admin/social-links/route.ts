import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { socialLinkSchema } from "@/lib/validations/social-links.schema";
import { 
  getAllSocialLinks, 
  getSocialLinkById, 
  createNewSocialLink, 
  updateSocialLinkById, 
  removeSocialLink 
} from "@/lib/services/social-links.service";

// GET all social links
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const links = await getAllSocialLinks();
    
    return NextResponse.json({ success: true, data: links });
  } catch (error) {
    console.error("Get social links error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch social links" },
      { status: 500 }
    );
  }
}

// POST create social link
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = socialLinkSchema.parse(body);
    
    const link = await createNewSocialLink(validatedData, user.id);
    
    return NextResponse.json(
      { success: true, data: link },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create social link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create social link" },
      { status: 500 }
    );
  }
}
