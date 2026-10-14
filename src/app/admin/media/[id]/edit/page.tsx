import { MediaForm } from "@/components/admin/forms/media-form";

// TODO: load the record by id from Supabase and pass it as `initial`.
export default function EditMediaPage() {
  return <MediaForm mode="edit" />;
}
