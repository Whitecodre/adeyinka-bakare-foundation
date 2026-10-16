import { createNews, updateNews, deleteNews, findAllNews, findNewsById, findNewsBySlug } from "../repositories/news.repository";
import type { NewsInsert } from "../types/database.types";
import { generateUniqueSlug } from "../utils/slug";

export async function getAllNews() {
  return findAllNews();
}

export async function getNewsById(id: string) {
  return findNewsById(id);
}

export async function getNewsBySlug(slug: string) {
  return findNewsBySlug(slug);
}

export async function createNewNews(data: Omit<NewsInsert, "slug">, actorId: string) {
  const slug = await generateUniqueSlug(data.title, async (slug) => {
    const existing = await findNewsBySlug(slug);
    return !!existing;
  });

  const newsData: NewsInsert = {
    ...data,
    slug,
    published_at: data.status === "published" ? new Date().toISOString() : null,
  };

  return createNews(newsData);
}

export async function updateNewsById(id: string, data: Partial<NewsInsert>, actorId: string) {
  return updateNews(id, data);
}

export async function removeNews(id: string, actorId: string) {
  return deleteNews(id);
}
