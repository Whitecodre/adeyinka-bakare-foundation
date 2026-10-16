import { NextRequest, NextResponse } from "next/server";
import { getAllEvents } from "@/lib/services/events.service";

export async function GET(request: NextRequest) {
  try {
    const events = await getAllEvents();

    // Filter to only show published events
    const published = events.filter((e: any) => e.status === "published");

    return NextResponse.json({ success: true, data: published });
  } catch (error) {
    console.error("Get events error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
