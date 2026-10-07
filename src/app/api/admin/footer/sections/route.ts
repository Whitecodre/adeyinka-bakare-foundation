import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { footerSectionSchema } from "@/lib/validations/footer.schema";
import { 
  getAllFooterSections, 
  createNewFooterSection, 
  updateFooterSectionById, 
  removeFooterSection 
} from "@/lib/services/footer.service";

// GET all footer sections
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const sections = await getAllFooterSections();
    
    return NextResponse.json({ success: true, data: sections });
  } catch (error) {
    console.error("Get footer sections error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer sections" },
      { status: 500 }
    );
  }
}

// POST create footer section
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = footerSectionSchema.parse(body);
    
    const section = await createNewFooterSection(validatedData, user.id);
    
    return NextResponse.json(
      { success: true, data: section },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create footer section error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create footer section" },
      { status: 500 }
    );
  }
}
