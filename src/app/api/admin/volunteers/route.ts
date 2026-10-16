import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { volunteerSchema } from "@/lib/validations/volunteers.schema";
import {
  getAllVolunteers,
  getVolunteerById,
  createNewVolunteer,
  updateVolunteerById,
  removeVolunteer
} from "@/lib/services/volunteers.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET all volunteers
export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePermission("volunteers", "read");
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const volunteers = await getAllVolunteers();
    
    // Filter by status if provided
    const filtered = status 
      ? volunteers.filter(v => v.status === status)
      : volunteers;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
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
    const { user } = await requirePermission("volunteers", "create");

    const body = await request.json();
    const validatedData = volunteerSchema.parse(body);

    const volunteer = await createNewVolunteer(validatedData, user.id);

    // Notify admins about new volunteer
    await notifyAdmins({
      title: "New Volunteer Application",
      message: `A new volunteer application from "${validatedData.full_name}" has been received.`,
      ctaUrl: "/admin/volunteers",
      ctaLabel: "View Applications",
    });

    return NextResponse.json(
      { success: true, data: volunteer },
      { status: 201 }
    );
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Create volunteer error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create volunteer" },
      { status: 500 }
    );
  }
}
