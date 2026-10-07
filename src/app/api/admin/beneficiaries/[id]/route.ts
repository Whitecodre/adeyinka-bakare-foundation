import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { beneficiarySchema } from "@/lib/validations/beneficiaries.schema";
import { 
  getBeneficiaryById, 
  updateBeneficiaryById, 
  removeBeneficiary 
} from "@/lib/services/beneficiaries.service";

// GET beneficiary by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const beneficiary = await getBeneficiaryById(id);
    
    if (!beneficiary) {
      return NextResponse.json(
        { success: false, error: "Beneficiary not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: beneficiary });
  } catch (error) {
    console.error("Get beneficiary error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch beneficiary" },
      { status: 500 }
    );
  }
}

// PATCH update beneficiary
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const body = await request.json();
    const validatedData = beneficiarySchema.partial().parse(body);
    
    const beneficiary = await updateBeneficiaryById(id, validatedData, user.id);
    
    return NextResponse.json({ success: true, data: beneficiary });
  } catch (error) {
    console.error("Update beneficiary error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update beneficiary" },
      { status: 500 }
    );
  }
}

// DELETE beneficiary
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    await removeBeneficiary(id, user.id);
    
    return NextResponse.json({ success: true, message: "Beneficiary deleted" });
  } catch (error) {
    console.error("Delete beneficiary error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete beneficiary" },
      { status: 500 }
    );
  }
}
