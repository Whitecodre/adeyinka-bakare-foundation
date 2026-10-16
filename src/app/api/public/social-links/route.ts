import { NextRequest, NextResponse } from "next/server";
import { getAllSocialLinks } from "@/lib/services/social-links.service";

export async function GET(request: NextRequest) {
  try {
    const links = await getAllSocialLinks();

    return NextResponse.json({ success: true, data: links });
  } catch (error) {
    console.error("Get social links error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch social links" },
      { status: 500 }
    );
  }
}
