import { createAdminClient } from "../supabase/admin";

export async function deleteFile(path: string, bucket: string = "media"): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}
