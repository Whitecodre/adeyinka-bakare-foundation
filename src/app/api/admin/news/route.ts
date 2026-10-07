import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { newsSchema } from "@/lib/validations/news.schema";
import { 
  getAllNews, 
  getNewsById, 
  createNewNews, 
  updateNewsById, 
  removeNews 
} from "@/lib/services/news.service";

// GET all news
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const news = await getAllNews();
    
    // Filter by status if provided
    const filtered = status 
      ? news.filter(n => n.status === status)
      : news;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
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
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = newsSchema.parse(body);
    
    const newsItem = await createNewNews(validatedData, user.id);
    
    return NextResponse.json(
      { success: true, data: newsItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create news error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create news" },
      { status: 500 }
    );
  }
}
