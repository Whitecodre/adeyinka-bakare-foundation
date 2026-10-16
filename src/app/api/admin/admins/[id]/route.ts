import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { adminSchema } from "@/lib/validations/admins.schema";
import {
  getAdminById,
  updateAdminById,
  removeAdmin
} from "@/lib/services/admins.service";
import {
  getAllAdmins,
} from "@/lib/services/admins.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

/** True if `id` is the only active super admin left. */
async function isLastSuperAdmin(id: string) {
  const all = await getAllAdmins();
  const active = all.filter((a) => a.role === "super_admin" && a.status === "active");
  return active.length === 1 && active[0].id === id;
}

function blocked(error: string) {
  return NextResponse.json({ success: false, error }, { status: 400 });
}

// GET admin by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("admins", "read");
    const { id } = await params;
    
    const admin = await getAdminById(id);
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: admin });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get admin error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin" },
      { status: 500 }
    );
  }
}

// PATCH update admin
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("admins", "update");
    const { id } = await params;

    const body = await request.json();
    const validatedData = adminSchema.partial().parse(body);

    const demotes = validatedData.role !== undefined && validatedData.role !== "super_admin";
    const deactivates = validatedData.status !== undefined && validatedData.status !== "active";
    if ((demotes || deactivates) && (await isLastSuperAdmin(id))) {
      return blocked("There must always be at least one active super admin.");
    }

    const admin = await updateAdminById(id, validatedData, user.id);

    // Notify admins about admin update
    await notifyAdmins({
      title: "Admin Updated",
      message: `Admin "${admin.full_name}" has been updated.`,
      ctaUrl: `/admin/admins/${id}`,
      ctaLabel: "View Admin",
    });

    return NextResponse.json({ success: true, data: admin });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Update admin error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update admin" },
      { status: 500 }
    );
  }
}

// DELETE admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("admins", "delete");
    const { id } = await params;

    if (id === user.id) {
      return blocked("You cannot delete your own account.");
    }
    if (await isLastSuperAdmin(id)) {
      return blocked("There must always be at least one active super admin.");
    }

    // Get admin info before deletion for notification
    const admin = await getAdminById(id);
    await removeAdmin(id, user.id);

    // Notify admins about admin deletion
    await notifyAdmins({
      title: "Admin Removed",
      message: `Admin "${admin?.full_name || "Unknown"}" has been removed.`,
      ctaUrl: "/admin/admins",
      ctaLabel: "View Admins",
    });

    return NextResponse.json({ success: true, message: "Admin deleted" });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Delete admin error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete admin" },
      { status: 500 }
    );
  }
}
