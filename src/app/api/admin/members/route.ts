import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { memberSchema } from "@/lib/validations/members.schema";
import { 
  getAllMembers, 
  getMemberById, 
  createNewMember, 
  updateMemberById, 
  removeMember 
} from "@/lib/services/members.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET all members
export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePermission("members", "read");
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const members = await getAllMembers();
    
    // Filter by status if provided
    const filtered = status 
      ? members.filter(m => m.status === status)
      : members;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get members error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

// POST create member
export async function POST(request: NextRequest) {
  try {
    const { user } = await requirePermission("members", "create");

    const body = await request.json();
    const validatedData = memberSchema.parse(body);

    const member = await createNewMember(validatedData, user.id);

    // Notify admins about new member
    await notifyAdmins({
      title: "New Member Added",
      message: `A new member "${validatedData.full_name}" has been added to the fellowship.`,
      ctaUrl: "/admin/members",
      ctaLabel: "View Members",
    });

    return NextResponse.json(
      { success: true, data: member },
      { status: 201 }
    );
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Create member error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create member" },
      { status: 500 }
    );
  }
}
