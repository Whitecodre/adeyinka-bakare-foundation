export type UserRole = "super_admin" | "admin" | "editor";
export type RecordStatus = "draft" | "published" | "archived";
export type MemberStatus = "active" | "inactive" | "graduated" | "archived";
export type VolunteerStatus = "new" | "contacted" | "accepted" | "rejected" | "archived";
export type MediaType = "image" | "audio" | "video" | "document" | "other";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  status: "active" | "inactive" | "suspended";
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  department?: string;
  level?: string;
  session?: string;
  photo?: string;
  status: MemberStatus;
  joined_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  department?: string;
  level?: string;
  interest?: string;
  message?: string;
  status: VolunteerStatus;
  created_at: string;
  updated_at: string;
}

export interface Programme {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  status: RecordStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Beneficiary {
  id: string;
  full_name: string;
  department?: string;
  level?: string;
  session?: string;
  programme?: string;
  photo?: string;
  bio?: string;
  status: RecordStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  beneficiary_id?: string;
  content: string;
  media_url?: string;
  media_type?: MediaType;
  featured: boolean;
  status: RecordStatus;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  location?: string;
  start_at: string;
  end_at?: string;
  image?: string;
  status: RecordStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author_id?: string;
  status: RecordStatus;
  published_at?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  filename: string;
  storage_path: string;
  type: MediaType;
  mime_type?: string;
  size_bytes?: number;
  uploaded_by?: string;
  created_at: string;
}

export interface Content {
  id: string;
  key: string;
  title?: string;
  content?: string;
  image?: string;
  status: RecordStatus;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FooterSection {
  id: string;
  title: string;
  sort_order: number;
  is_active: boolean;
}

export interface FooterLink {
  id: string;
  section_id: string;
  label: string;
  url: string;
  sort_order: number;
  is_active: boolean;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline?: string;
  logo?: string;
  favicon?: string;
  email?: string;
  phone?: string;
  address?: string;
  whatsapp?: string;
  updated_by?: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  is_active: boolean;
  sort_order: number;
}

export interface Notification {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  read_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  action: string;
  entity: string;
  entity_id?: string;
  old_data?: any;
  new_data?: any;
  created_at: string;
}
