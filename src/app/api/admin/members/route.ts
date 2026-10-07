import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { memberSchema } from "@/lib/validations/members.schema";
import { 
  getAllMembers, 
  getMemberById, 
  createNewMember, 
  updateMemberById, 
  removeMember 
} from "@/lib/services/members.service";

// GET all members
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const members = await getAllMembers();
    
    // Filter by status if provided
    const filtered = status 
      ? members.filter(m => m.status === status)
      : members;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
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
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = memberSchema.parse(body);
    
    const member = await createNewMember(validatedData, user.id);
    
    return NextResponse.json(
      { success: true, data: member },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create member error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create member" },
      { status: 500 }
    );
  }
}
