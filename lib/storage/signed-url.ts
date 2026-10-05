import { createAdminClient } from "../supabase/admin";

export async function generateSignedUrl(
  path: string,
  expiresIn: number = 60,
  bucket: string = "media"
): Promise<string> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;

  return data.signedUrl;
}
