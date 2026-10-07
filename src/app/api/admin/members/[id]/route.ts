import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { memberSchema } from "@/lib/validations/members.schema";
import { 
  getMemberById, 
  updateMemberById, 
  removeMember 
} from "@/lib/services/members.service";

// GET member by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const member = await getMemberById(id);
    
    if (!member) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    console.error("Get member error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch member" },
      { status: 500 }
    );
  }
}

// PATCH update member
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const body = await request.json();
    const validatedData = memberSchema.partial().parse(body);
    
    const member = await updateMemberById(id, validatedData, user.id);
    
    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    console.error("Update member error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update member" },
      { status: 500 }
    );
  }
}

// DELETE member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    await removeMember(id, user.id);
    
    return NextResponse.json({ success: true, message: "Member deleted" });
  } catch (error) {
    console.error("Delete member error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete member" },
      { status: 500 }
    );
  }
}
