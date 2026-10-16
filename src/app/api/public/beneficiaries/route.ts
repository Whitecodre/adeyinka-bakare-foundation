import { NextRequest, NextResponse } from "next/server";
import { getAllBeneficiaries } from "@/lib/services/beneficiaries.service";

export async function GET(request: NextRequest) {
  try {
    const beneficiaries = await getAllBeneficiaries();

    // Filter to only show published beneficiaries
    const published = beneficiaries.filter((b: any) => b.status === "published");

    return NextResponse.json({ success: true, data: published });
  } catch (error) {
    console.error("Get beneficiaries error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch beneficiaries" },
      { status: 500 }
    );
  }
}
