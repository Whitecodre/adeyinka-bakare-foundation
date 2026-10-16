import { NextRequest, NextResponse } from "next/server";
import { findBeneficiaryById } from "@/lib/repositories/beneficiaries.repository";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const row = await findBeneficiaryById(id);

    if (!row || (row as any).status !== "published") {
      return NextResponse.json(
        { success: false, error: "Beneficiary not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: row });
  } catch (error) {
    console.error("Get public beneficiary by id error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch beneficiary" },
      { status: 500 }
    );
  }
}
