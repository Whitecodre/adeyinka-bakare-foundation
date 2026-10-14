import { NextRequest, NextResponse } from "next/server";
import { memberSchema } from "@/lib/validations/members.schema";
import { createNewMember } from "@/lib/services/members.service";
import { sendEmail } from "@/lib/email/send";
import { memberWelcomeEmail } from "@/lib/email/templates";
import { logEmail, notifyAdmins } from "@/lib/email/log";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = memberSchema.parse(body);

    // Create member via service layer
    const member = await createNewMember(validatedData);
    try {
      const { subject, html, text } = memberWelcomeEmail({ fullName: validatedData.full_name });
      const email = (validatedData as any).email;
      if (email) {
        const info: any = await sendEmail({ to: email, subject, html, text });
        await logEmail({ to_email: email, to_name: validatedData.full_name, subject, template: "member_welcome", html_preview: html, status: "sent", provider_id: info?.messageId, metadata: { member_id: (member as any)?.id } });
      }
    } catch (e: any) { try { const em = (validatedData as any).email; if (em) await logEmail({ to_email: em, subject: "Member welcome", template: "member_welcome", status: "failed", error: e.message }); } catch {} }
    try { await notifyAdmins({ title: "New member", message: `${validatedData.full_name} joined${(validatedData as any).department ? ` -- ${(validatedData as any).department}` : ""}.`, type: "new_member", data: { member_id: (member as any)?.id } }); } catch {}

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
