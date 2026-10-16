import {
  findAllMedia,
  findMediaById,
  createNewMedia as repoCreateNewMedia,
  updateMedia as repoUpdateMedia,
  removeMedia as repoRemoveMedia,
} from "../repositories/media.repository";
import { publicUrlForMedia } from "../storage/public-url";
import type { Database } from "../types/database.types";

type Media = Database["public"]["Tables"]["media"]["Row"];
type MediaInsert = Database["public"]["Tables"]["media"]["Insert"];
type MediaUpdate = Database["public"]["Tables"]["media"]["Update"];

type Uploader = { id: string; full_name: string | null } | null;

export type MediaWithUrl = Media & {
  public_url: string | null;
  uploader?: Uploader;
};

function withPublicUrl(row: (Media & { uploader?: Uploader }) | null): MediaWithUrl | null {
  if (!row) return null;
  return { ...row, public_url: publicUrlForMedia(row.storage_path) };
}

export async function getAllMedia(): Promise<MediaWithUrl[]> {
  const rows = await findAllMedia();
  return rows.map((r) => withPublicUrl(r)!);
}

export async function getMediaById(id: string): Promise<MediaWithUrl | null> {
  const row = await findMediaById(id);
  return withPublicUrl(row);
}

export async function createNewMedia(data: MediaInsert, actorId: string) {
  const payload: MediaInsert = { ...data, uploaded_by: actorId };
  return repoCreateNewMedia(payload);
}

export async function updateMediaById(id: string, data: Partial<MediaInsert>, actorId: string) {
  return repoUpdateMedia(id, data);
}

export async function removeMedia(id: string, actorId: string) {
  return repoRemoveMedia(id);
}

