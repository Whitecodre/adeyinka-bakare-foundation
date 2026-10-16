import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { newsSchema } from "@/lib/validations/news.schema";
import {
  getAllNews,
  getNewsById,
  createNewNews,
  updateNewsById,
  removeNews
} from "@/lib/services/news.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET all news
export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePermission("news", "read");
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const news = await getAllNews();
    
    // Filter by status if provided
    const filtered = status 
      ? news.filter(n => n.status === status)
      : news;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get news error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// POST create news
export async function POST(request: NextRequest) {
  try {
    const { user } = await requirePermission("news", "create");

    const body = await request.json();
    const validatedData = newsSchema.parse(body);

    const newsItem = await createNewNews(validatedData, user.id);

    // Notify admins about new news article
    await notifyAdmins({
      title: "New News Article Created",
      message: `A new article "${validatedData.title}" has been created.`,
      ctaUrl: "/admin/news",
      ctaLabel: "View News",
    });

    return NextResponse.json(
      { success: true, data: newsItem },
      { status: 201 }
    );
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Create news error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create news" },
      { status: 500 }
    );
  }
}
