import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { footerLinkSchema } from "@/lib/validations/footer.schema";
import {
  getFooterLinkById,
  updateFooterLinkById,
  removeFooterLink
} from "@/lib/services/footer.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET footer link by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("footer", "read");
    const { id } = await params;
    
    const link = await getFooterLinkById(id);
    
    if (!link) {
      return NextResponse.json(
        { success: false, error: "Footer link not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get footer link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer link" },
      { status: 500 }
    );
  }
}

// PATCH update footer link
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("footer", "update");
    const { id } = await params;

    const body = await request.json();
    const validatedData = footerLinkSchema.partial().parse(body);

    const link = await updateFooterLinkById(id, validatedData, user.id);

    // Notify admins about footer link update
    await notifyAdmins({
      title: "Footer Link Updated",
      message: `Footer link "${link.label}" has been updated.`,
      ctaUrl: "/admin/footer",
      ctaLabel: "View Footer",
    });

    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Update footer link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update footer link" },
      { status: 500 }
    );
  }
}

// DELETE footer link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("footer", "delete");
    const { id } = await params;

    // Get link info before deletion for notification
    const link = await getFooterLinkById(id);
    await removeFooterLink(id, user.id);

    // Notify admins about footer link deletion
    await notifyAdmins({
      title: "Footer Link Deleted",
      message: `Footer link "${link?.label || "Unknown"}" has been deleted.`,
      ctaUrl: "/admin/footer",
      ctaLabel: "View Footer",
    });

    return NextResponse.json({ success: true, message: "Footer link deleted" });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Delete footer link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete footer link" },
      { status: 500 }
    );
  }
}
