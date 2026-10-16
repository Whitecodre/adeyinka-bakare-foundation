import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { volunteerAdminUpdateSchema } from "@/lib/validations/volunteers.schema";
import { 
  getVolunteerById, 
  updateVolunteerById, 
  removeVolunteer 
} from "@/lib/services/volunteers.service";

// GET volunteer by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("volunteers", "read");
    const { id } = await params;
    
    const volunteer = await getVolunteerById(id);
    
    if (!volunteer) {
      return NextResponse.json(
        { success: false, error: "Volunteer not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: volunteer });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get volunteer error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch volunteer" },
      { status: 500 }
    );
  }
}

// PATCH update volunteer
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("volunteers", "update");
    const { id } = await params;
    
    const body = await request.json();
    const validatedData = volunteerAdminUpdateSchema.parse(body);
    
    const volunteer = await updateVolunteerById(id, validatedData, user.id);
    
    return NextResponse.json({ success: true, data: volunteer });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Update volunteer error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update volunteer" },
      { status: 500 }
    );
  }
}

// DELETE volunteer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("volunteers", "delete");
    const { id } = await params;
    
    await removeVolunteer(id, user.id);
    
    return NextResponse.json({ success: true, message: "Volunteer deleted" });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Delete volunteer error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete volunteer" },
      { status: 500 }
    );
  }
}
