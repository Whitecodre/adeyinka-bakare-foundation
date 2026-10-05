export const STORAGE_PATHS = {
  IMAGES: "images",
  VIDEOS: "videos",
  AUDIO: "audio",
  DOCUMENTS: "documents",
  OTHER: "other",
} as const;

export function getStoragePath(type: string, filename: string): string {
  const folder = STORAGE_PATHS[type.toUpperCase() as keyof typeof STORAGE_PATHS] || STORAGE_PATHS.OTHER;
  return `${folder}/${filename}`;
}

export function generateStoragePath(type: string, filename: string): string {
  const timestamp = Date.now();
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return getStoragePath(type, `${timestamp}-${cleanFilename}`);
}
