import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { programmeSchema } from "@/lib/validations/programmes.schema";
import { 
  getAllProgrammes, 
  getProgrammeById, 
  createNewProgramme, 
  updateProgrammeById, 
  removeProgramme 
} from "@/lib/services/programmes.service";

// GET all programmes
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const programmes = await getAllProgrammes();
    
    // Filter by status if provided
    const filtered = status 
      ? programmes.filter(p => p.status === status)
      : programmes;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("Get programmes error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch programmes" },
      { status: 500 }
    );
  }
}

// POST create programme
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = programmeSchema.parse(body);
    
    const programme = await createNewProgramme(validatedData, user.id);
    
    return NextResponse.json(
      { success: true, data: programme },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create programme error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create programme" },
      { status: 500 }
    );
  }
}
