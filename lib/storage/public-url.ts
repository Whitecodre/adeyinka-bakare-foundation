import { createAdminClient } from "../supabase/admin";
import { resolveStorageUrl } from "./paths";

/**
 * Build a public Supabase Storage URL for a stored path. Returns null
 * if no path was given. If `path` is already an absolute URL it is
 * returned as-is.
 */
export function publicUrlForPath(bucket: string, path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  try {
    const supabase = createAdminClient();
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl ?? null;
  } catch {
    return null;
  }
}

/**
 * Build a public URL for a media-library item. The `media` table doesn't
 * store the bucket, so callers must pass it in (defaults to
 * `public-media` because that's what the media resource maps to).
 */
export function publicUrlForMedia(path: string | null | undefined, bucket: string = "public-media") {
  return publicUrlForPath(bucket, path);
}

export { resolveStorageUrl };
