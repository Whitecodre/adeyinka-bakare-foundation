export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: "super_admin" | "admin" | "editor";
          status: "active" | "inactive" | "suspended";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: "super_admin" | "admin" | "editor";
          status?: "active" | "inactive" | "suspended";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: "super_admin" | "admin" | "editor";
          status?: "active" | "inactive" | "suspended";
          created_at?: string;
          updated_at?: string;
        };
      };
      members: {
        Row: {
          id: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          department: string | null;
          level: string | null;
          session: string | null;
          photo: string | null;
          status: "active" | "inactive" | "graduated" | "archived";
          joined_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          department?: string | null;
          level?: string | null;
          session?: string | null;
          photo?: string | null;
          status?: "active" | "inactive" | "graduated" | "archived";
          joined_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string | null;
          phone?: string | null;
          department?: string | null;
          level?: string | null;
          session?: string | null;
          photo?: string | null;
          status?: "active" | "inactive" | "graduated" | "archived";
          joined_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      volunteers: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          department: string | null;
          level: string | null;
          interest: string | null;
          message: string | null;
          status: "new" | "contacted" | "accepted" | "rejected" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          department?: string | null;
          level?: string | null;
          interest?: string | null;
          message?: string | null;
          status?: "new" | "contacted" | "accepted" | "rejected" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          department?: string | null;
          level?: string | null;
          interest?: string | null;
          message?: string | null;
          status?: "new" | "contacted" | "accepted" | "rejected" | "archived";
          created_at?: string;
          updated_at?: string;
        };
      };
      programmes: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          image: string | null;
          status: "draft" | "published" | "archived";
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          image?: string | null;
          status?: "draft" | "published" | "archived";
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          image?: string | null;
          status?: "draft" | "published" | "archived";
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      beneficiaries: {
        Row: {
          id: string;
          full_name: string;
          department: string | null;
          level: string | null;
          session: string | null;
          programme: string | null;
          photo: string | null;
          bio: string | null;
          status: "draft" | "published" | "archived";
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          department?: string | null;
          level?: string | null;
          session?: string | null;
          programme?: string | null;
          photo?: string | null;
          bio?: string | null;
          status?: "draft" | "published" | "archived";
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          department?: string | null;
          level?: string | null;
          session?: string | null;
          programme?: string | null;
          photo?: string | null;
          bio?: string | null;
          status?: "draft" | "published" | "archived";
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          beneficiary_id: string | null;
          content: string;
          media_url: string | null;
          media_type: "image" | "audio" | "video" | "document" | "other" | null;
          featured: boolean;
          status: "draft" | "published" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          beneficiary_id?: string | null;
          content: string;
          media_url?: string | null;
          media_type?: "image" | "audio" | "video" | "document" | "other" | null;
          featured?: boolean;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          beneficiary_id?: string | null;
          content?: string;
          media_url?: string | null;
          media_type?: "image" | "audio" | "video" | "document" | "other" | null;
          featured?: boolean;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          location: string | null;
          start_at: string;
          end_at: string | null;
          image: string | null;
          status: "draft" | "published" | "archived";
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          location?: string | null;
          start_at: string;
          end_at?: string | null;
          image?: string | null;
          status?: "draft" | "published" | "archived";
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          location?: string | null;
          start_at?: string;
          end_at?: string | null;
          image?: string | null;
          status?: "draft" | "published" | "archived";
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      news: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          image: string | null;
          author_id: string | null;
          status: "draft" | "published" | "archived";
          published_at: string | null;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          image?: string | null;
          author_id?: string | null;
          status?: "draft" | "published" | "archived";
          published_at?: string | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          image?: string | null;
          author_id?: string | null;
          status?: "draft" | "published" | "archived";
          published_at?: string | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      media: {
        Row: {
          id: string;
          filename: string;
          storage_path: string;
          type: "image" | "audio" | "video" | "document" | "other";
          mime_type: string | null;
          size_bytes: number | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          filename: string;
          storage_path: string;
          type: "image" | "audio" | "video" | "document" | "other";
          mime_type?: string | null;
          size_bytes?: number | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          filename?: string;
          storage_path?: string;
          type?: "image" | "audio" | "video" | "document" | "other";
          mime_type?: string | null;
          size_bytes?: number | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
      };
      contents: {
        Row: {
          id: string;
          key: string;
          title: string | null;
          content: string | null;
          image: string | null;
          status: "draft" | "published" | "archived";
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          title?: string | null;
          content?: string | null;
          image?: string | null;
          status?: "draft" | "published" | "archived";
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          title?: string | null;
          content?: string | null;
          image?: string | null;
          status?: "draft" | "published" | "archived";
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      footer_sections: {
        Row: {
          id: string;
          title: string;
          sort_order: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      footer_links: {
        Row: {
          id: string;
          section_id: string;
          label: string;
          url: string;
          sort_order: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          section_id: string;
          label: string;
          url: string;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          section_id?: string;
          label?: string;
          url?: string;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      site_settings: {
        Row: {
          id: string;
          site_name: string;
          tagline: string | null;
          logo: string | null;
          favicon: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          whatsapp: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_name: string;
          tagline?: string | null;
          logo?: string | null;
          favicon?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          whatsapp?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_name?: string;
          tagline?: string | null;
          logo?: string | null;
          favicon?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          whatsapp?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          url: string;
          is_active: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          platform: string;
          url: string;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: {
          id?: string;
          platform?: string;
          url?: string;
          is_active?: boolean;
          sort_order?: number;
        };
      };
      notifications: {
        Row: {
          id: string;
          recipient_id: string;
          type: string;
          title: string;
          message: string;
          data: Json;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_id: string;
          type: string;
          title: string;
          message: string;
          data?: Json;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient_id?: string;
          type?: string;
          title?: string;
          message?: string;
          data?: Json;
          read_at?: string | null;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity: string;
          entity_id: string | null;
          old_data: Json | null;
          new_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity: string;
          entity_id?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          entity?: string;
          entity_id?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          created_at?: string;
        };
      };
      admin_mfa: {
        Row: {
          id: string;
          admin_id: string;
          totp_enabled: boolean;
          encrypted_totp_secret: string | null;
          email_otp_enabled: boolean;
          passkey_enabled: boolean;
          mfa_required: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          totp_enabled?: boolean;
          encrypted_totp_secret?: string | null;
          email_otp_enabled?: boolean;
          passkey_enabled?: boolean;
          mfa_required?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          totp_enabled?: boolean;
          encrypted_totp_secret?: string | null;
          email_otp_enabled?: boolean;
          passkey_enabled?: boolean;
          mfa_required?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_passkeys: {
        Row: {
          id: string;
          admin_id: string;
          credential_id: string;
          public_key: Buffer;
          counter: number;
          device_name: string | null;
          last_used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          credential_id: string;
          public_key: Buffer;
          counter?: number;
          device_name?: string | null;
          last_used_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          credential_id?: string;
          public_key?: Buffer;
          counter?: number;
          device_name?: string | null;
          last_used_at?: string | null;
          created_at?: string;
        };
      };
      mfa_recovery_codes: {
        Row: {
          id: string;
          admin_id: string;
          code_hash: string;
          used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          code_hash: string;
          used_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          code_hash?: string;
          used_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

// Export commonly used types for convenience
export type MemberInsert = Database["public"]["Tables"]["members"]["Insert"];
export type MemberUpdate = Database["public"]["Tables"]["members"]["Update"];
export type VolunteerInsert = Database["public"]["Tables"]["volunteers"]["Insert"];
export type VolunteerUpdate = Database["public"]["Tables"]["volunteers"]["Update"];
export type ProgrammeInsert = Database["public"]["Tables"]["programmes"]["Insert"];
export type ProgrammeUpdate = Database["public"]["Tables"]["programmes"]["Update"];
export type BeneficiaryInsert = Database["public"]["Tables"]["beneficiaries"]["Insert"];
export type BeneficiaryUpdate = Database["public"]["Tables"]["beneficiaries"]["Update"];
export type TestimonialInsert = Database["public"]["Tables"]["testimonials"]["Insert"];
export type TestimonialUpdate = Database["public"]["Tables"]["testimonials"]["Update"];
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type EventUpdate = Database["public"]["Tables"]["events"]["Update"];
export type NewsInsert = Database["public"]["Tables"]["news"]["Insert"];
export type NewsUpdate = Database["public"]["Tables"]["news"]["Update"];
export type MediaInsert = Database["public"]["Tables"]["media"]["Insert"];
export type MediaUpdate = Database["public"]["Tables"]["media"]["Update"];
export type ContentInsert = Database["public"]["Tables"]["contents"]["Insert"];
export type ContentUpdate = Database["public"]["Tables"]["contents"]["Update"];
export type AdminMfaInsert = Database["public"]["Tables"]["admin_mfa"]["Insert"];
export type AdminMfaUpdate = Database["public"]["Tables"]["admin_mfa"]["Update"];
export type AdminPasskeyInsert = Database["public"]["Tables"]["admin_passkeys"]["Insert"];
export type MfaRecoveryCodesInsert = Database["public"]["Tables"]["mfa_recovery_codes"]["Insert"];
export type FooterSectionInsert = Database["public"]["Tables"]["footer_sections"]["Insert"];
export type FooterSectionUpdate = Database["public"]["Tables"]["footer_sections"]["Update"];
export type FooterLinkInsert = Database["public"]["Tables"]["footer_links"]["Insert"];
export type FooterLinkUpdate = Database["public"]["Tables"]["footer_links"]["Update"];
export type SocialLinkInsert = Database["public"]["Tables"]["social_links"]["Insert"];
export type SocialLinkUpdate = Database["public"]["Tables"]["social_links"]["Update"];
export type SiteSettingsUpdate = Database["public"]["Tables"]["site_settings"]["Update"];
export type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"];
export type NotificationUpdate = Database["public"]["Tables"]["notifications"]["Update"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
