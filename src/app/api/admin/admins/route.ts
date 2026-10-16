import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { adminSchema, adminCreateSchema } from "@/lib/validations/admins.schema";
import {
  getAllAdmins,
  getAdminById,
  createNewAdmin,
  updateAdminById,
  removeAdmin
} from "@/lib/services/admins.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET all admins
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const admins = await getAllAdmins();
    
    // Filter by status if provided
    const filtered = status 
      ? admins.filter(a => a.status === status)
      : admins;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("Get admins error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

// POST create admin
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validatedData = adminCreateSchema.parse(body);

    const admin = await createNewAdmin(validatedData, user.id);

    // Note: Email notifications for admin creation are handled by the invite system
    // This is for creating admins directly, which should notify other admins
    await notifyAdmins({
      title: "New Admin Added",
      message: `A new admin "${validatedData.full_name}" has been added.`,
      ctaUrl: "/admin/admins",
      ctaLabel: "View Admins",
    });

    return NextResponse.json(
      { success: true, data: admin },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create admin" },
      { status: 500 }
    );
  }
}
