import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { eventSchema } from "@/lib/validations/events.schema";
import { 
  getAllEvents, 
  getEventById, 
  createNewEvent, 
  updateEventById, 
  removeEvent 
} from "@/lib/services/events.service";

// GET all events
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const events = await getAllEvents();
    
    // Filter by status if provided
    const filtered = status 
      ? events.filter(e => e.status === status)
      : events;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
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
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = eventSchema.parse(body);
    
    const event = await createNewEvent(validatedData, user.id);
    
    return NextResponse.json(
      { success: true, data: event },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create event" },
      { status: 500 }
    );
  }
}
