import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { newsSchema } from "@/lib/validations/news.schema";
import { 
  getNewsById, 
  updateNewsById, 
  removeNews 
} from "@/lib/services/news.service";

// GET news by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
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
    const user = await requireAuth();
    const { id } = await params;
    
    const body = await request.json();
    const validatedData = newsSchema.partial().parse(body);
    
    const newsItem = await updateNewsById(id, validatedData, user.id);
    
    return NextResponse.json({ success: true, data: newsItem });
  } catch (error) {
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
    const user = await requireAuth();
    const { id } = await params;
    
    await removeNews(id, user.id);
    
    return NextResponse.json({ success: true, message: "News deleted" });
  } catch (error) {
    console.error("Delete news error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
