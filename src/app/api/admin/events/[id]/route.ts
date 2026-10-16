import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { eventSchema } from "@/lib/validations/events.schema";
import {
  getEventById,
  updateEventById,
  removeEvent
} from "@/lib/services/events.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET event by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("events", "read");
    const { id } = await params;
    
    const event = await getEventById(id);
    
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get event error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PATCH update event
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("events", "update");
    const { id } = await params;

    const body = await request.json();
    const validatedData = eventSchema.partial().parse(body);

    const event = await updateEventById(id, validatedData, user.id);

    // Notify admins about event update
    await notifyAdmins({
      title: "Event Updated",
      message: `Event "${event.title}" has been updated.`,
      ctaUrl: `/admin/events/${id}`,
      ctaLabel: "View Event",
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Update event error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("events", "delete");
    const { id } = await params;

    // Get event info before deletion for notification
    const event = await getEventById(id);
    await removeEvent(id, user.id);

    // Notify admins about event deletion
    await notifyAdmins({
      title: "Event Deleted",
      message: `Event "${event?.title || "Unknown"}" has been deleted.`,
      ctaUrl: "/admin/events",
      ctaLabel: "View Events",
    });

    return NextResponse.json({ success: true, message: "Event deleted" });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Delete event error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
