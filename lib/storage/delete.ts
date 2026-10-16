import { createAdminClient } from "../supabase/admin";

export async function deleteFile(path: string, bucket: string): Promise<void> {
  if (!bucket) throw new Error("Bucket is required");
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}
