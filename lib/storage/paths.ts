export const STORAGE_BUCKETS = {
  "programme-images": "programme-images",
  "event-images": "event-images",
  "news-images": "news-images",
  "testimonial-media": "testimonial-media",
  "content-images": "content-images",
  "social-icons": "social-icons",
  "logo-assets": "logo-assets",
  "public-images": "public-images",
  "public-media": "public-media",
  "private-documents": "private-documents",
  "admin-uploads": "admin-uploads",
} as const;

export const RESOURCE_BUCKET_MAP: Record<string, string> = {
  news: "news-images",
  programmes: "programme-images",
  events: "event-images",
  testimonials: "testimonial-media",
  beneficiaries: "public-images",
  members: "public-images",
  contents: "content-images",
  media: "public-media",
  "social-links": "social-icons",
  settings: "logo-assets",
  footer: "public-images",
};

export function getBucketForResource(resource: string): string {
  return RESOURCE_BUCKET_MAP[resource] ?? "public-images";
}

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

export function generateStoragePathWithOwner(ownerId: string, type: string, filename: string): string {
  const timestamp = Date.now();
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const folder = STORAGE_PATHS[type.toUpperCase() as keyof typeof STORAGE_PATHS] || STORAGE_PATHS.OTHER;
  return `${ownerId}/${folder}/${timestamp}-${cleanFilename}`;
}
