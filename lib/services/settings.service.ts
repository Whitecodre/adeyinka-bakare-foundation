import { getSiteSettings, updateSiteSettings } from "../repositories/settings.repository";
import type { SiteSettingsUpdate } from "../types/database.types";

export async function getSettings() {
  return getSiteSettings();
}

export async function updateSettings(data: SiteSettingsUpdate, actorId: string) {
  return updateSiteSettings({ ...data, updated_by: actorId });
}
