import { NextRequest, NextResponse } from "next/server";
import { findNewsBySlug } from "@/lib/repositories/news.repository";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const row = await findNewsBySlug(slug);

    if (!row || (row as any).status !== "published") {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: row });
  } catch (error) {
    console.error("Get public news by slug error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
