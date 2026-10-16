import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { beneficiarySchema } from "@/lib/validations/beneficiaries.schema";
import {
  getBeneficiaryById,
  updateBeneficiaryById,
  removeBeneficiary
} from "@/lib/services/beneficiaries.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET beneficiary by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("beneficiaries", "read");
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
    const denied = authErrorResponse(error);
    if (denied) return denied;
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
    const { user } = await requirePermission("beneficiaries", "update");
    const { id } = await params;

    const body = await request.json();
    const validatedData = beneficiarySchema.partial().parse(body);

    const beneficiary = await updateBeneficiaryById(id, validatedData, user.id);

    // Notify admins about beneficiary update
    await notifyAdmins({
      title: "Beneficiary Updated",
      message: `Beneficiary "${beneficiary.full_name}" has been updated.`,
      ctaUrl: `/admin/beneficiaries/${id}`,
      ctaLabel: "View Beneficiary",
    });

    return NextResponse.json({ success: true, data: beneficiary });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
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
    const { user } = await requirePermission("beneficiaries", "delete");
    const { id } = await params;

    // Get beneficiary info before deletion for notification
    const beneficiary = await getBeneficiaryById(id);
    await removeBeneficiary(id, user.id);

    // Notify admins about beneficiary deletion
    await notifyAdmins({
      title: "Beneficiary Deleted",
      message: `Beneficiary "${beneficiary?.full_name || "Unknown"}" has been deleted.`,
      ctaUrl: "/admin/beneficiaries",
      ctaLabel: "View Beneficiaries",
    });

    return NextResponse.json({ success: true, message: "Beneficiary deleted" });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Delete beneficiary error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete beneficiary" },
      { status: 500 }
    );
  }
}
