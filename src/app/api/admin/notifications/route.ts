import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { notificationSchema } from "@/lib/validations/notifications.schema";
import { 
  getUserNotifications, 
  getUnreadNotifications, 
  markAllAsRead,
  getNotificationById, 
  createNewNotification, 
  updateNotificationById, 
  removeNotification 
} from "@/lib/services/notifications.service";

// GET all notifications for the current user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread") === "true";
    
    const notifications = unreadOnly 
      ? await getUnreadNotifications(user.id)
      : await getUserNotifications(user.id);
    
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST create notification (admin only - to send to other users)
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validatedData = notificationSchema.parse(body);

    const notification = await createNewNotification(validatedData as any, user.id);

    return NextResponse.json(
      { success: true, data: notification },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create notification" },
      { status: 500 }
    );
  }
}

// PATCH mark all notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    const { action } = body;
    
    if (action === "mark_all_read") {
      await markAllAsRead(user.id);
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }
    
    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Update notifications error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update notifications" },
      { status: 500 }
    );
  }
}
