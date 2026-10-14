import { NewsForm } from "@/components/admin/forms/news-form";

// TODO: load the article by id from Supabase and pass it as `initial`.
export default function EditNewsPage() {
  return <NewsForm mode="edit" />;
}
