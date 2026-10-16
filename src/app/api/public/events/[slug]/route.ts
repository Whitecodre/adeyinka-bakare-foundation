import { NextRequest, NextResponse } from "next/server";
import { findEventBySlug } from "@/lib/repositories/events.repository";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const row = await findEventBySlug(slug);

    if (!row || (row as any).status !== "published") {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: row });
  } catch (error) {
    console.error("Get public event by slug error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}
