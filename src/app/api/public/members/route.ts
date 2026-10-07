import { NextRequest, NextResponse } from "next/server";
import { memberSchema } from "@/lib/validations/members.schema";
import { createNewMember } from "@/lib/services/members.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = memberSchema.parse(body);

    // Create member via service layer
    const member = await createNewMember(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: member,
        message: "Member registration submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Member registration error:", error);

    if (error instanceof Error && error.message.includes("Invalid email")) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to submit member registration" },
      { status: 500 }
    );
  }
}
