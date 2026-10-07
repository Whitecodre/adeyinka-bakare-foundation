import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { footerSectionSchema } from "@/lib/validations/footer.schema";
import { 
  getFooterSectionById, 
  updateFooterSectionById, 
  removeFooterSection 
} from "@/lib/services/footer.service";

// GET footer section by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const section = await getFooterSectionById(id);
    
    if (!section) {
      return NextResponse.json(
        { success: false, error: "Footer section not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: section });
  } catch (error) {
    console.error("Get footer section error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer section" },
      { status: 500 }
    );
  }
}

// PATCH update footer section
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const body = await request.json();
    const validatedData = footerSectionSchema.partial().parse(body);
    
    const section = await updateFooterSectionById(id, validatedData, user.id);
    
    return NextResponse.json({ success: true, data: section });
  } catch (error) {
    console.error("Update footer section error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update footer section" },
      { status: 500 }
    );
  }
}

// DELETE footer section
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    await removeFooterSection(id, user.id);
    
    return NextResponse.json({ success: true, message: "Footer section deleted" });
  } catch (error) {
    console.error("Delete footer section error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete footer section" },
      { status: 500 }
    );
  }
}
