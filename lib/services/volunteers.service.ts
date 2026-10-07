import { createVolunteer, updateVolunteer, deleteVolunteer, findAllVolunteers, findVolunteerById } from "../repositories/volunteers.repository";
import type { VolunteerInsert } from "../types/database.types";

export async function getAllVolunteers() {
  return findAllVolunteers();
}

export async function getVolunteerById(id: string) {
  return findVolunteerById(id);
}

export async function createNewVolunteer(data: VolunteerInsert, actorId?: string) {
  return createVolunteer(data);
}

export async function updateVolunteerById(id: string, data: Partial<VolunteerInsert>, actorId: string) {
  return updateVolunteer(id, data);
}

export async function removeVolunteer(id: string, actorId: string) {
  return deleteVolunteer(id);
}
