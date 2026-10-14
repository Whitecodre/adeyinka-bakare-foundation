import { ContentForm } from "@/components/admin/forms/content-form";

// TODO: load the record by id from Supabase and pass it as `initial`.
export default function EditContentPage() {
  return <ContentForm mode="edit" />;
}
