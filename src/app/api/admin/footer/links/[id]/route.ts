import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { footerLinkSchema } from "@/lib/validations/footer.schema";
import { 
  getFooterLinkById, 
  updateFooterLinkById, 
  removeFooterLink 
} from "@/lib/services/footer.service";

// GET footer link by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const link = await getFooterLinkById(id);
    
    if (!link) {
      return NextResponse.json(
        { success: false, error: "Footer link not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error("Get footer link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer link" },
      { status: 500 }
    );
  }
}

// PATCH update footer link
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    const body = await request.json();
    const validatedData = footerLinkSchema.partial().parse(body);
    
    const link = await updateFooterLinkById(id, validatedData, user.id);
    
    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error("Update footer link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update footer link" },
      { status: 500 }
    );
  }
}

// DELETE footer link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    
    await removeFooterLink(id, user.id);
    
    return NextResponse.json({ success: true, message: "Footer link deleted" });
  } catch (error) {
    console.error("Delete footer link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete footer link" },
      { status: 500 }
    );
  }
}
