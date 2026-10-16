import { createProgramme, updateProgramme, deleteProgramme, findAllProgrammes, findProgrammeById, findProgrammeBySlug } from "../repositories/programmes.repository";
import type { ProgrammeInsert } from "../types/database.types";
import { generateUniqueSlug } from "../utils/slug";

export async function getAllProgrammes() {
  return findAllProgrammes();
}

export async function getProgrammeById(id: string) {
  return findProgrammeById(id);
}

export async function getProgrammeBySlug(slug: string) {
  return findProgrammeBySlug(slug);
}

export async function createNewProgramme(data: Omit<ProgrammeInsert, "slug">, actorId: string) {
  const slug = await generateUniqueSlug(data.title, async (slug) => {
    const existing = await findProgrammeBySlug(slug);
    return !!existing;
  });

  return createProgramme({ ...data, slug });
}

export async function updateProgrammeById(id: string, data: Partial<ProgrammeInsert>, actorId: string) {
  return updateProgramme(id, data);
}

export async function removeProgramme(id: string, actorId: string) {
  return deleteProgramme(id);
}
