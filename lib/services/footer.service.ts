import {
  createFooterSection,
  updateFooterSection,
  deleteFooterSection,
  findAllFooterSections,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
} from "../repositories/footer.repository";
import type { FooterSectionInsert, FooterLinkInsert } from "../types/database.types";

export async function getAllFooterSections() {
  return findAllFooterSections();
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

export async function createNewFooterLink(data: FooterLinkInsert, actorId: string) {
  return createFooterLink(data);
}

export async function updateFooterLinkById(id: string, data: Partial<FooterLinkInsert>, actorId: string) {
  return updateFooterLink(id, data);
}

export async function removeFooterLink(id: string, actorId: string) {
  return deleteFooterLink(id);
}
