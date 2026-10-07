import { NextRequest, NextResponse } from "next/server";
import { getAllProgrammes } from "@/lib/services/programmes.service";

export async function GET(request: NextRequest) {
  try {
    const programmes = await getAllProgrammes();

    // Filter to only show published programmes
    const published = programmes.filter((p: any) => p.status === "published");

    return NextResponse.json({ success: true, data: published });
  } catch (error) {
    console.error("Get programmes error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch programmes" },
      { status: 500 }
    );
  }
}
