import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { beneficiarySchema } from "@/lib/validations/beneficiaries.schema";
import {
  getAllBeneficiaries,
  getBeneficiaryById,
  createNewBeneficiary,
  updateBeneficiaryById,
  removeBeneficiary
} from "@/lib/services/beneficiaries.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET all beneficiaries
export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePermission("beneficiaries", "read");
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const beneficiaries = await getAllBeneficiaries();
    
    // Filter by status if provided
    const filtered = status 
      ? beneficiaries.filter(b => b.status === status)
      : beneficiaries;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
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
    const { user } = await requirePermission("beneficiaries", "create");

    const body = await request.json();
    const validatedData = beneficiarySchema.parse(body);

    const beneficiary = await createNewBeneficiary(validatedData, user.id);

    // Notify admins about new beneficiary
    await notifyAdmins({
      title: "New Beneficiary Added",
      message: `A new beneficiary "${validatedData.full_name}" has been added.`,
      ctaUrl: "/admin/beneficiaries",
      ctaLabel: "View Beneficiaries",
    });

    return NextResponse.json(
      { success: true, data: beneficiary },
      { status: 201 }
    );
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Create beneficiary error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create beneficiary" },
      { status: 500 }
    );
  }
}
