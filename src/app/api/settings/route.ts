import { NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/lib/services/settings.service";

// GET public site settings
export async function GET(request: NextRequest) {
  try {
    const settings = await getSettings();

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
