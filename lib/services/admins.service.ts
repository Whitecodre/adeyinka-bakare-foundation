import { createProfile, updateProfile, deleteProfile, findAllProfiles, findProfileById } from "../repositories/profiles.repository";
import type { ProfileInsert } from "../types/database.types";

export async function getAllAdmins() {
  return findAllProfiles();
}

export async function getAdminById(id: string) {
  return findProfileById(id);
}

export async function createNewAdmin(data: ProfileInsert, actorId: string) {
  return createProfile(data);
}

export async function updateAdminById(id: string, data: Partial<ProfileInsert>, actorId: string) {
  return updateProfile(id, data);
}

export async function removeAdmin(id: string, actorId: string) {
  return deleteProfile(id);
}
