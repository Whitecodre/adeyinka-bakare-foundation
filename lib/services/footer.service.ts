import {
  createFooterSection,
  updateFooterSection,
  deleteFooterSection,
  findAllFooterSections,
  findFooterSectionById,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
  findFooterLinkById,
  findAllFooterLinks,
} from "../repositories/footer.repository";
import type { FooterSectionInsert, FooterLinkInsert } from "../types/database.types";

export async function getAllFooterSections() {
  return findAllFooterSections();
}

export async function getFooterSectionById(id: string) {
  return findFooterSectionById(id);
}

export async function createNewFooterSection(data: FooterSectionInsert, actorId: string) {
  return createFooterSection(data);
}

export async function updateFooterSectionById(id: string, data: Partial<FooterSectionInsert>, actorId: string) {
  return updateFooterSection(id, data);
}

export async function removeFooterSection(id: string, actorId: string) {
  return deleteFooterSection(id);
}

export async function getAllFooterLinks() {
  return findAllFooterLinks();
}

export async function createNewFooterLink(data: FooterLinkInsert, actorId: string) {
  return createFooterLink(data);
}

export async function getFooterLinkById(id: string) {
  return findFooterLinkById(id);
}

export async function updateFooterLinkById(id: string, data: Partial<FooterLinkInsert>, actorId: string) {
  return updateFooterLink(id, data);
}

export async function removeFooterLink(id: string, actorId: string) {
  return deleteFooterLink(id);
}
