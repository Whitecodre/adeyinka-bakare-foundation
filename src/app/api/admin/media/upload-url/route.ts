import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { uploadFile } from "@/lib/storage/upload";
import { getBucketForResource } from "@/lib/storage/paths";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requirePermission("media", "create");
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "image";
    let bucket = formData.get("bucket") as string | null;
    const resource = (formData.get("resource") as string) || "";

    if (!file) return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    if (!bucket && resource) bucket = getBucketForResource(resource);
    if (!bucket) bucket = getBucketForResource("media");

    // Validate size vs bucket limits (light)
    const maxByBucket: Record<string, number> = {
      "public-images": 10 * 1024 * 1024,
      "news-images": 10 * 1024 * 1024,
      "programme-images": 10 * 1024 * 1024,
      "event-images": 10 * 1024 * 1024,
      "content-images": 10 * 1024 * 1024,
      "public-media": 50 * 1024 * 1024,
      "testimonial-media": 50 * 1024 * 1024,
      "social-icons": 512 * 1024,
      "logo-assets": 5 * 1024 * 1024,
      "admin-uploads": 100 * 1024 * 1024,
    };
    const max = maxByBucket[bucket] ?? 10 * 1024 * 1024;
    if (file.size > max) return NextResponse.json({ success: false, error: `File too large for ${bucket} (max ${Math.round(max/1024/1024)}MB)` }, { status: 400 });

    const result = await uploadFile(file as unknown as File, type as any, bucket, user.id);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    const denied = authErrorResponse(err);
    if (denied) return denied;
    const msg = err?.message ?? "Upload failed";
    const status = msg.includes("Unauthorized") || msg.includes("Forbidden") ? 401 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
