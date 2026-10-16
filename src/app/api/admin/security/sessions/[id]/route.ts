import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const { id: sessionId } = await params;

    // Try RPC function first
    const { error: rpcError } = await supabase.rpc("delete_admin_session", {
      p_session_id: sessionId,
      p_admin_id: user.id,
    });

    if (rpcError) {
      // If RPC doesn't exist, try direct delete
      const { error: deleteError } = await supabase
        .from("admin_sessions")
        .delete()
        .eq("id", sessionId)
        .eq("admin_id", user.id);

      if (deleteError) throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    console.error("Delete session error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
