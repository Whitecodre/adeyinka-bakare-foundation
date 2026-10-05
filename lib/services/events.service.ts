import { createEvent, updateEvent, deleteEvent, findAllEvents, findEventById, findEventBySlug } from "../repositories/events.repository";
import type { EventInsert } from "../types/database.types";
import { generateUniqueSlug } from "../utils/slug";

export async function getAllEvents() {
  return findAllEvents();
}

export async function getEventById(id: string) {
  return findEventById(id);
}

export async function getEventBySlug(slug: string) {
  return findEventBySlug(slug);
}

export async function createNewEvent(data: EventInsert, actorId: string) {
  const slug = await generateUniqueSlug(data.title, async (slug) => {
    const existing = await findEventBySlug(slug);
    return !!existing;
  });

  return createEvent({ ...data, slug });
}

export async function updateEventById(id: string, data: Partial<EventInsert>, actorId: string) {
  return updateEvent(id, data);
}

export async function removeEvent(id: string, actorId: string) {
  return deleteEvent(id);
}
