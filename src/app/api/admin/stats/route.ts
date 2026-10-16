import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePermission("dashboard", "read");
    const supabase = await createClient();

    // Get counts from all tables
    const [
      membersCount,
      volunteersCount,
      beneficiariesCount,
      eventsCount,
      programmesCount,
      testimonialsCount,
      newsCount,
    ] = await Promise.all([
      supabase.from("members").select("*", { count: "exact", head: true }),
      supabase.from("volunteers").select("*", { count: "exact", head: true }),
      supabase.from("beneficiaries").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("programmes").select("*", { count: "exact", head: true }),
      supabase.from("testimonials").select("*", { count: "exact", head: true }),
      supabase.from("news").select("*", { count: "exact", head: true }),
    ]);

    const stats = {
      totalMembers: membersCount.count || 0,
      totalVolunteers: volunteersCount.count || 0,
      totalBeneficiaries: beneficiariesCount.count || 0,
      activeEvents: eventsCount.count || 0,
      totalProgrammes: programmesCount.count || 0,
      totalTestimonials: testimonialsCount.count || 0,
      totalNews: newsCount.count || 0,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}