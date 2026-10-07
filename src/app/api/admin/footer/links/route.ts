import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { footerLinkSchema } from "@/lib/validations/footer.schema";
import { 
  createNewFooterLink, 
  getFooterLinkById, 
  updateFooterLinkById, 
  removeFooterLink 
} from "@/lib/services/footer.service";
import { findAllFooterSections } from "@/lib/repositories/footer.repository";

// GET all footer links
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get("section_id");
    
    // Get all sections with their links
    const sections = await findAllFooterSections();
    
    // Extract all links from sections
    let links: any[] = [];
    sections.forEach((section: any) => {
      if (section.footer_links) {
        links = [...links, ...section.footer_links];
      }
    });
    
    // Filter by section if provided
    const filtered = sectionId 
      ? links.filter((l: any) => l.section_id === sectionId)
      : links;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("Get footer links error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer links" },
      { status: 500 }
    );
  }
}

// POST create footer link
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = footerLinkSchema.parse(body);
    
    const link = await createNewFooterLink(validatedData, user.id);
    
    return NextResponse.json(
      { success: true, data: link },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create footer link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create footer link" },
      { status: 500 }
    );
  }
}
