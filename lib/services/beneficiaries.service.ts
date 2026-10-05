import { createBeneficiary, updateBeneficiary, deleteBeneficiary, findAllBeneficiaries, findBeneficiaryById } from "../repositories/beneficiaries.repository";
import type { BeneficiaryInsert } from "../types/database.types";

export async function getAllBeneficiaries() {
  return findAllBeneficiaries();
}

export async function getBeneficiaryById(id: string) {
  return findBeneficiaryById(id);
}

export async function createNewBeneficiary(data: BeneficiaryInsert, actorId: string) {
  return createBeneficiary(data);
}

export async function updateBeneficiaryById(id: string, data: Partial<BeneficiaryInsert>, actorId: string) {
  return updateBeneficiary(id, data);
}

export async function removeBeneficiary(id: string, actorId: string) {
  return deleteBeneficiary(id);
}
