import { createAdminClient } from "../supabase/admin";
import { createClient } from "../supabase/server";
import { generateStoragePath, generateStoragePathWithOwner } from "./paths";
import type { MediaType } from "../types/domain.types";

export async function uploadFile(
  file: File,
  type: MediaType,
  bucket: string,
  ownerId?: string
): Promise<{ path: string; url: string; bucket: string }> {
  if (!bucket) throw new Error("Bucket is required");
  const supabase = createAdminClient();
  const path = ownerId ? generateStoragePathWithOwner(ownerId, type, file.name) : generateStoragePath(type, file.name);

  const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });

  if (error) throw error;

  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
  // Private buckets need signed URL; caller should use getSignedUrl instead
  return { path: data.path, url: pub.publicUrl, bucket };
}

export async function uploadFileForCurrentUser(
  file: File,
  type: MediaType,
  bucket: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const ownerId = user?.id ?? "anon";
  return uploadFile(file, type, bucket, ownerId);
}
