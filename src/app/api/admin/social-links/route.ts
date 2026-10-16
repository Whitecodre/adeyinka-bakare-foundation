import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { socialLinkSchema } from "@/lib/validations/social-links.schema";
import {
  getAllSocialLinks,
  getSocialLinkById,
  createNewSocialLink,
  updateSocialLinkById,
  removeSocialLink
} from "@/lib/services/social-links.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET all social links
export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePermission("socialLinks", "read");
    
    const links = await getAllSocialLinks();
    
    return NextResponse.json({ success: true, data: links });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
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
    const { user } = await requirePermission("socialLinks", "create");

    const body = await request.json();
    const validatedData = socialLinkSchema.parse(body);

    const link = await createNewSocialLink(validatedData, user.id);

    // Notify admins about new social link
    await notifyAdmins({
      title: "Social Link Added",
      message: `A new social link for "${validatedData.platform}" has been added.`,
      ctaUrl: "/admin/social-links",
      ctaLabel: "View Links",
    });

    return NextResponse.json(
      { success: true, data: link },
      { status: 201 }
    );
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Create social link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create social link" },
      { status: 500 }
    );
  }
}
