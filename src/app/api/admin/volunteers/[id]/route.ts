import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { volunteerSchema } from "@/lib/validations/volunteers.schema";
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
    const user = await requireAuth();
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
    const user = await requireAuth();
    const { id } = await params;
    
    const body = await request.json();
    const validatedData = volunteerSchema.partial().parse(body);
    
    const volunteer = await updateVolunteerById(id, validatedData, user.id);
    
    return NextResponse.json({ success: true, data: volunteer });
  } catch (error) {
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
    const user = await requireAuth();
    const { id } = await params;
    
    await removeVolunteer(id, user.id);
    
    return NextResponse.json({ success: true, message: "Volunteer deleted" });
  } catch (error) {
    console.error("Delete volunteer error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete volunteer" },
      { status: 500 }
    );
  }
}
