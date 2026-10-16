import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { footerSectionSchema } from "@/lib/validations/footer.schema";
import {
  getAllFooterSections,
  createNewFooterSection,
  updateFooterSectionById,
  removeFooterSection
} from "@/lib/services/footer.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET all footer sections
export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePermission("footer", "read");
    
    const sections = await getAllFooterSections();
    
    return NextResponse.json({ success: true, data: sections });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get footer sections error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer sections" },
      { status: 500 }
    );
  }
}

// POST create footer section
export async function POST(request: NextRequest) {
  try {
    const { user } = await requirePermission("footer", "create");

    const body = await request.json();
    const validatedData = footerSectionSchema.parse(body);

    const section = await createNewFooterSection(validatedData, user.id);

    // Notify admins about footer section creation
    await notifyAdmins({
      title: "Footer Section Added",
      message: `Footer section "${validatedData.title}" has been added.`,
      ctaUrl: "/admin/footer",
      ctaLabel: "View Footer",
    });

    return NextResponse.json(
      { success: true, data: section },
      { status: 201 }
    );
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Create footer section error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create footer section" },
      { status: 500 }
    );
  }
}
