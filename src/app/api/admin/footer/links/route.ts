import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { footerLinkSchema } from "@/lib/validations/footer.schema";
import {
  createNewFooterLink,
  getFooterLinkById,
  updateFooterLinkById,
  removeFooterLink
} from "@/lib/services/footer.service";
import { findAllFooterSections } from "@/lib/repositories/footer.repository";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET all footer links
export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePermission("footer", "read");
    
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
    const denied = authErrorResponse(error);
    if (denied) return denied;
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
    const { user } = await requirePermission("footer", "create");

    const body = await request.json();
    const validatedData = footerLinkSchema.parse(body);

    const link = await createNewFooterLink(validatedData, user.id);

    // Notify admins about footer link creation
    await notifyAdmins({
      title: "Footer Link Added",
      message: `Footer link "${validatedData.label}" has been added.`,
      ctaUrl: "/admin/footer",
      ctaLabel: "View Footer",
    });

    return NextResponse.json(
      { success: true, data: link },
      { status: 201 }
    );
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Create footer link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create footer link" },
      { status: 500 }
    );
  }
}
