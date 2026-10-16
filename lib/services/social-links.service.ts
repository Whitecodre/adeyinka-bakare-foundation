import { createSocialLink, updateSocialLink, deleteSocialLink, findAllSocialLinks, findSocialLinkById } from "../repositories/social-links.repository";
import type { SocialLinkInsert } from "../types/database.types";

export async function getAllSocialLinks() {
  return findAllSocialLinks();
}

export async function getSocialLinkById(id: string) {
  return findSocialLinkById(id);
}

export async function createNewSocialLink(data: SocialLinkInsert, actorId: string) {
  return createSocialLink(data);
}

export async function updateSocialLinkById(id: string, data: Partial<SocialLinkInsert>, actorId: string) {
  return updateSocialLink(id, data);
}

export async function removeSocialLink(id: string, actorId: string) {
  return deleteSocialLink(id);
}
