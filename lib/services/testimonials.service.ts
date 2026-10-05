import { createTestimonial, updateTestimonial, deleteTestimonial, findAllTestimonials, findTestimonialById } from "../repositories/testimonials.repository";
import type { TestimonialInsert } from "../types/database.types";

export async function getAllTestimonials() {
  return findAllTestimonials();
}

export async function getTestimonialById(id: string) {
  return findTestimonialById(id);
}

export async function createNewTestimonial(data: TestimonialInsert, actorId: string) {
  return createTestimonial(data);
}

export async function updateTestimonialById(id: string, data: Partial<TestimonialInsert>, actorId: string) {
  return updateTestimonial(id, data);
}

export async function removeTestimonial(id: string, actorId: string) {
  return deleteTestimonial(id);
}
