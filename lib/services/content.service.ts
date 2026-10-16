import {
  findAllContents,
  findPublishedContents,
  findContentById,
  findContentByKey,
  createNewContent as repoCreateNewContent,
  updateContent as repoUpdateContent,
  removeContent as repoRemoveContent,
} from "../repositories/content.repository";
import type { ContentInsert, ContentUpdate } from "../types/database.types";

export async function getAllContents() {
  return findAllContents();
}

export async function getPublishedContents() {
  return findPublishedContents();
}

export async function getContentById(id: string) {
  return findContentById(id);
}

export async function getContentByKey(key: string) {
  return findContentByKey(key);
}

export async function createNewContent(data: ContentInsert, actorId: string) {
  return repoCreateNewContent(data);
}

export async function updateContentById(id: string, data: Partial<ContentInsert>, actorId: string) {
  return repoUpdateContent(id, data);
}

export async function removeContent(id: string, actorId: string) {
  return repoRemoveContent(id);
}
