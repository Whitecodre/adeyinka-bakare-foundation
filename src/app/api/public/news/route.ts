import { NextRequest, NextResponse } from "next/server";
import { findPublishedNews } from "@/lib/repositories/news.repository";

export async function GET(request: NextRequest) {
  try {
    const rows = await findPublishedNews();

    // Sort featured first, then by published_at desc
    const sorted = [...rows].sort((a: any, b: any) => {
      if (Boolean(a.featured) !== Boolean(b.featured)) {
        return a.featured ? -1 : 1;
      }
      const ad = a.published_at ? new Date(a.published_at).getTime() : 0;
      const bd = b.published_at ? new Date(b.published_at).getTime() : 0;
      return bd - ad;
    });

    return NextResponse.json({ success: true, data: sorted });
  } catch (error) {
    console.error("Get public news error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
