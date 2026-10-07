import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { volunteerSchema } from "@/lib/validations/volunteers.schema";
import { 
  getAllVolunteers, 
  getVolunteerById, 
  createNewVolunteer, 
  updateVolunteerById, 
  removeVolunteer 
} from "@/lib/services/volunteers.service";

// GET all volunteers
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const volunteers = await getAllVolunteers();
    
    // Filter by status if provided
    const filtered = status 
      ? volunteers.filter(v => v.status === status)
      : volunteers;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("Get volunteers error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch volunteers" },
      { status: 500 }
    );
  }
}

// POST create volunteer
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = volunteerSchema.parse(body);
    
    const volunteer = await createNewVolunteer(validatedData, user.id);
    
    return NextResponse.json(
      { success: true, data: volunteer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create volunteer error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create volunteer" },
      { status: 500 }
    );
  }
}
