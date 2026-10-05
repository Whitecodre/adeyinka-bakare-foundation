export const RECORD_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export const RECORD_STATUS_LABELS = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
} as const;

export const MEMBER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  GRADUATED: "graduated",
  ARCHIVED: "archived",
} as const;

export const MEMBER_STATUS_LABELS = {
  active: "Active",
  inactive: "Inactive",
  graduated: "Graduated",
  archived: "Archived",
} as const;

export const VOLUNTEER_STATUS = {
  NEW: "new",
  CONTACTED: "contacted",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  ARCHIVED: "archived",
} as const;

export const VOLUNTEER_STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  accepted: "Accepted",
  rejected: "Rejected",
  archived: "Archived",
} as const;

export const MEDIA_TYPE = {
  IMAGE: "image",
  AUDIO: "audio",
  VIDEO: "video",
  DOCUMENT: "document",
  OTHER: "other",
} as const;

export const MEDIA_TYPE_LABELS = {
  image: "Image",
  audio: "Audio",
  video: "Video",
  document: "Document",
  other: "Other",
} as const;
