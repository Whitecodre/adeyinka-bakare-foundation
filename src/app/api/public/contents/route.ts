import { NextRequest, NextResponse } from "next/server";
import { getPublishedContents, getContentByKey } from "@/lib/services/content.service";

// GET all published contents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      // Get specific content by key
      const content = await getContentByKey(key);
      return NextResponse.json({ success: true, data: content });
    }

    // Get all published contents
    const contents = await getPublishedContents();
    return NextResponse.json({ success: true, data: contents });
  } catch (error) {
    console.error("Get contents error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contents" },
      { status: 500 }
    );
  }
}
