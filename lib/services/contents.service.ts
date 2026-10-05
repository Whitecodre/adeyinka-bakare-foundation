import { createContent, updateContent, deleteContent, findAllContents, findContentByKey } from "../repositories/contents.repository";
import type { ContentInsert } from "../types/database.types";

export async function getAllContents() {
  return findAllContents();
}

export async function getContentByKey(key: string) {
  return findContentByKey(key);
}

export async function createNewContent(data: ContentInsert, actorId: string) {
  return createContent({ ...data, updated_by: actorId });
}

export async function updateContentById(id: string, data: Partial<ContentInsert>, actorId: string) {
  return updateContent(id, { ...data, updated_by: actorId });
}

export async function removeContent(id: string, actorId: string) {
  return deleteContent(id);
}
