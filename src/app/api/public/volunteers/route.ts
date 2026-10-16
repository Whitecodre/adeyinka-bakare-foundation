import { NextRequest, NextResponse } from "next/server";
import { volunteerSchema } from "@/lib/validations/volunteers.schema";
import { createNewVolunteer } from "@/lib/services/volunteers.service";
import { sendEmail } from "@/lib/email/send";
import { volunteerReceivedEmail } from "@/lib/email/templates";
import { logEmail } from "@/lib/email/log";
import { notifyAdmins } from "@/lib/email/admin-notifications";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = volunteerSchema.parse(body);
    
    // Create volunteer via service layer
    const volunteer = await createNewVolunteer(validatedData);
    try {
      const { subject, html, text } = volunteerReceivedEmail({ fullName: validatedData.full_name, interest: (validatedData as any).interest });
      const info: any = await sendEmail({ to: validatedData.email, subject, html, text });
      await logEmail({ to_email: validatedData.email, to_name: validatedData.full_name, subject, template: "volunteer_received", html_preview: html, status: "sent", provider_id: info?.messageId, metadata: { volunteer_id: (volunteer as any)?.id } });
    } catch (e: any) { try { await logEmail({ to_email: validatedData.email, subject: "Volunteer received", template: "volunteer_received", status: "failed", error: e.message }); } catch {} }
    try { await notifyAdmins({ title: "New Volunteer Application", message: `${validatedData.full_name} (${validatedData.email}) applied${(validatedData as any).interest ? ` for ${(validatedData as any).interest}` : ""}.`, ctaUrl: "/admin/volunteers", ctaLabel: "View Applications" }); } catch {}

    return NextResponse.json(
      { 
        success: true, 
        data: volunteer,
        message: "Volunteer application submitted successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Volunteer submission error:", error);
    
    if (error instanceof Error && error.message.includes("Invalid email")) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to submit volunteer application" },
      { status: 500 }
    );
  }
}
