import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { beneficiarySchema } from "@/lib/validations/beneficiaries.schema";
import { 
  getAllBeneficiaries, 
  getBeneficiaryById, 
  createNewBeneficiary, 
  updateBeneficiaryById, 
  removeBeneficiary 
} from "@/lib/services/beneficiaries.service";

// GET all beneficiaries
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const beneficiaries = await getAllBeneficiaries();
    
    // Filter by status if provided
    const filtered = status 
      ? beneficiaries.filter(b => b.status === status)
      : beneficiaries;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("Get beneficiaries error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch beneficiaries" },
      { status: 500 }
    );
  }
}

// POST create beneficiary
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = beneficiarySchema.parse(body);
    
    const beneficiary = await createNewBeneficiary(validatedData, user.id);
    
    return NextResponse.json(
      { success: true, data: beneficiary },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create beneficiary error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create beneficiary" },
      { status: 500 }
    );
  }
}
