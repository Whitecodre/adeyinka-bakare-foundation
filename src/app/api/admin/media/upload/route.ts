import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requirePermission("media", "create");

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string || "public-images";
    const folder = formData.get("folder") as string || "uploads";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if bucket exists, create if not
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error("List buckets error:", bucketsError);
    }

    const bucketExists = buckets?.some(b => b.name === bucket);
    if (!bucketExists) {
      console.log(`Bucket "${bucket}" does not exist, creating it...`);
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: true,
      });
      if (createError) {
        console.error("Create bucket error:", createError);
        return NextResponse.json(
          { success: false, error: `Bucket "${bucket}" does not exist and could not be created: ${createError.message}` },
          { status: 500 }
        );
      }
      console.log(`Bucket "${bucket}" created successfully`);
    }

    const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      data: {
        path: data.path,
        url: publicUrlData.publicUrl,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
      },
    });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    );
  }
}
