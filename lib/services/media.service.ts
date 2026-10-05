import { createMedia, updateMedia, deleteMedia, findAllMedia, findMediaById } from "../repositories/media.repository";
import type { MediaInsert } from "../types/database.types";

export async function getAllMedia() {
  return findAllMedia();
}

export async function getMediaById(id: string) {
  return findMediaById(id);
}

export async function createNewMedia(data: MediaInsert, actorId: string) {
  return createMedia({ ...data, uploaded_by: actorId });
}

export async function updateMediaById(id: string, data: Partial<MediaInsert>, actorId: string) {
  return updateMedia(id, data);
}

export async function removeMedia(id: string, actorId: string) {
  return deleteMedia(id);
}
