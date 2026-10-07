import { NextRequest, NextResponse } from "next/server";
import { volunteerSchema } from "@/lib/validations/volunteers.schema";
import { createNewVolunteer } from "@/lib/services/volunteers.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = volunteerSchema.parse(body);
    
    // Create volunteer via service layer
    const volunteer = await createNewVolunteer(validatedData);
    
    return NextResponse.json(
      { 
        success: true, 
        data: volunteer,
        message: "Volunteer application submitted successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Volunteer submission error:", error);
    
    if (error instanceof Error && error.message.includes("Invalid email")) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to submit volunteer application" },
      { status: 500 }
    );
  }
}
