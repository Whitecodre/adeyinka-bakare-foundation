import { createAdminClient } from "../supabase/admin";
import { generateStoragePath } from "./paths";
import type { MediaType } from "../types/domain.types";

export async function uploadFile(
  file: File,
  type: MediaType,
  bucket: string = "media"
): Promise<{ path: string; url: string }> {
  const supabase = createAdminClient();
  const path = generateStoragePath(type, file.name);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return { path: data.path, url: publicUrl };
}
