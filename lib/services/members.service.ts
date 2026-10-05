import { createMember, updateMember, deleteMember, findAllMembers, findMemberById } from "../repositories/members.repository";
import type { MemberInsert } from "../types/database.types";
import { generateUniqueSlug } from "../utils/slug";

export async function getAllMembers() {
  return findAllMembers();
}

export async function getMemberById(id: string) {
  return findMemberById(id);
}

export async function createNewMember(data: MemberInsert, actorId: string) {
  return createMember(data);
}

export async function updateMemberById(id: string, data: Partial<MemberInsert>, actorId: string) {
  return updateMember(id, data);
}

export async function removeMember(id: string, actorId: string) {
  return deleteMember(id);
}
