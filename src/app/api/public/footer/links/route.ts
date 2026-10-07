import { NextRequest, NextResponse } from "next/server";
import { getAllFooterLinks } from "@/lib/services/footer.service";

export async function GET(request: NextRequest) {
  try {
    const links = await getAllFooterLinks();

    return NextResponse.json({ success: true, data: links });
  } catch (error) {
    console.error("Get footer links error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer links" },
      { status: 500 }
    );
  }
}
