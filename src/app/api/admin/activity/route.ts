import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { createClient } from "@/lib/supabase/server";

interface ActivityItem {
  id: string;
  action: string;
  user: string;
  time: string;
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePermission("dashboard", "read");
    const supabase = await createClient();

    // Get recent activity from audit logs
    const { data: auditLogs, error } = await supabase
      .from("audit_logs")
      .select("*, actor_id")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching audit logs:", error);
      return NextResponse.json({ success: true, data: [] });
    }

    // Get user names for the activities
    const activity: ActivityItem[] = [];

    for (const log of auditLogs || []) {
      const actorId = log.actor_id;

      // Get actor name
      let userName = "Unknown";
      if (actorId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", actorId)
          .single();
        userName = profile?.full_name || "Unknown";
      }

      const time = new Date(log.created_at).toLocaleString();

      activity.push({
        id: log.id,
        action: `${log.action} ${log.entity}`,
        user: userName,
        time,
      });
    }

    return NextResponse.json({ success: true, data: activity.reverse() });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get activity error:", error);
    return NextResponse.json({ success: true, data: [] });
  }
}