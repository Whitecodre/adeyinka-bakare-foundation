import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { adminSchema } from "@/lib/validations/admins.schema";
import { 
  getAdminById, 
  updateAdminById, 
  removeAdmin 
} from "@/lib/services/admins.service";

// GET admin by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const admin = await getAdminById(id);
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: admin });
  } catch (error) {
    console.error("Get admin error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin" },
      { status: 500 }
    );
  }
}

// PATCH update admin
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const body = await request.json();
    const validatedData = adminSchema.partial().parse(body);
    
    const admin = await updateAdminById(id, validatedData, user.id);
    
    return NextResponse.json({ success: true, data: admin });
  } catch (error) {
    console.error("Update admin error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update admin" },
      { status: 500 }
    );
  }
}

// DELETE admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    await removeAdmin(id, user.id);
    
    return NextResponse.json({ success: true, message: "Admin deleted" });
  } catch (error) {
    console.error("Delete admin error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete admin" },
      { status: 500 }
    );
  }
}
