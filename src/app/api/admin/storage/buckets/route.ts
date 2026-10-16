import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    const supabase = await createClient();

    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("List buckets error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("List buckets error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to list buckets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const { bucket, public: isPublic } = body;

    if (!bucket) {
      return NextResponse.json(
        { success: false, error: "Bucket name is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.storage.createBucket(bucket, {
      public: isPublic !== false,
    });

    if (error) {
      console.error("Create bucket error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Create bucket error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create bucket" },
      { status: 500 }
    );
  }
}
