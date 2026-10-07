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
