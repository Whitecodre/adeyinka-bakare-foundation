import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { eventSchema } from "@/lib/validations/events.schema";
import {
  getAllEvents,
  getEventById,
  createNewEvent,
  updateEventById,
  removeEvent
} from "@/lib/services/events.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET all events
export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePermission("events", "read");
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const events = await getAllEvents();
    
    // Filter by status if provided
    const filtered = status 
      ? events.filter(e => e.status === status)
      : events;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get events error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST create event
export async function POST(request: NextRequest) {
  try {
    const { user } = await requirePermission("events", "create");

    const body = await request.json();
    const validatedData = eventSchema.parse(body);

    const event = await createNewEvent(validatedData, user.id);

    // Notify admins about new event
    await notifyAdmins({
      title: "New Event Created",
      message: `A new event "${validatedData.title}" has been created.`,
      ctaUrl: "/admin/events",
      ctaLabel: "View Events",
    });

    return NextResponse.json(
      { success: true, data: event },
      { status: 201 }
    );
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Create event error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create event" },
      { status: 500 }
    );
  }
}
