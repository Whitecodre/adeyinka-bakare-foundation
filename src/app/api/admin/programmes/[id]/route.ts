import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { programmeSchema } from "@/lib/validations/programmes.schema";
import { 
  getProgrammeById, 
  updateProgrammeById, 
  removeProgramme 
} from "@/lib/services/programmes.service";

// GET programme by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const programme = await getProgrammeById(id);
    
    if (!programme) {
      return NextResponse.json(
        { success: false, error: "Programme not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: programme });
  } catch (error) {
    console.error("Get programme error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch programme" },
      { status: 500 }
    );
  }
}

// PATCH update programme
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const body = await request.json();
    const validatedData = programmeSchema.partial().parse(body);
    
    const programme = await updateProgrammeById(id, validatedData, user.id);
    
    return NextResponse.json({ success: true, data: programme });
  } catch (error) {
    console.error("Update programme error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update programme" },
      { status: 500 }
    );
  }
}

// DELETE programme
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    await removeProgramme(id, user.id);
    
    return NextResponse.json({ success: true, message: "Programme deleted" });
  } catch (error) {
    console.error("Delete programme error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete programme" },
      { status: 500 }
    );
  }
}
