import { NextRequest, NextResponse } from "next/server";
import { getAllFooterSections } from "@/lib/services/footer.service";

export async function GET(request: NextRequest) {
  try {
    const sections = await getAllFooterSections();

    return NextResponse.json({ success: true, data: sections });
  } catch (error) {
    console.error("Get footer sections error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer sections" },
      { status: 500 }
    );
  }
}
