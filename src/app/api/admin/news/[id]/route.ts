import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { newsSchema } from "@/lib/validations/news.schema";
import {
  getNewsById,
  updateNewsById,
  removeNews
} from "@/lib/services/news.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET news by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("news", "read");
    const { id } = await params;
    
    const newsItem = await getNewsById(id);
    
    if (!newsItem) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: newsItem });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get news error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// PATCH update news
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("news", "update");
    const { id } = await params;

    const body = await request.json();
    const validatedData = newsSchema.partial().parse(body);

    const newsItem = await updateNewsById(id, validatedData, user.id);

    // Notify admins about news update
    await notifyAdmins({
      title: "News Article Updated",
      message: `Article "${newsItem.title}" has been updated.`,
      ctaUrl: `/admin/news/${id}`,
      ctaLabel: "View Article",
    });

    return NextResponse.json({ success: true, data: newsItem });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Update news error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update news" },
      { status: 500 }
    );
  }
}

// DELETE news
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("news", "delete");
    const { id } = await params;

    // Get news info before deletion for notification
    const newsItem = await getNewsById(id);
    await removeNews(id, user.id);

    // Notify admins about news deletion
    await notifyAdmins({
      title: "News Article Deleted",
      message: `Article "${newsItem?.title || "Unknown"}" has been deleted.`,
      ctaUrl: "/admin/news",
      ctaLabel: "View News",
    });

    return NextResponse.json({ success: true, message: "News deleted" });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Delete news error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
