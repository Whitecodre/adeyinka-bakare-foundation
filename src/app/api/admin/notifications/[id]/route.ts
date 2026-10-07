import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { notificationSchema } from "@/lib/validations/notifications.schema";
import { 
  getNotificationById, 
  updateNotificationById, 
  markAsRead,
  removeNotification 
} from "@/lib/services/notifications.service";

// GET notification by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const notification = await getNotificationById(id);
    
    if (!notification) {
      return NextResponse.json(
        { success: false, error: "Notification not found" },
        { status: 404 }
      );
    }
    
    // Check if user owns this notification
    if (notification.recipient_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    console.error("Get notification error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch notification" },
      { status: 500 }
    );
  }
}

// PATCH update notification (e.g., mark as read)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const body = await request.json();
    const { action } = body;

    if (action === "mark_read") {
      const notification = await markAsRead(id);
      
      // Check if user owns this notification
      if (notification && notification.recipient_id !== user.id) {
        return NextResponse.json(
          { success: false, error: "Access denied" },
          { status: 403 }
        );
      }
      
      return NextResponse.json({ success: true, data: notification });
    }

    const validatedData = notificationSchema.partial().parse(body);
    const notification = await updateNotificationById(id, validatedData as any, user.id);

    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    console.error("Update notification error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update notification" },
      { status: 500 }
    );
  }
}

// DELETE notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    // First check if user owns this notification
    const notification = await getNotificationById(id);
    if (notification && notification.recipient_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }
    
    await removeNotification(id);
    
    return NextResponse.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete notification" },
      { status: 500 }
    );
  }
}
