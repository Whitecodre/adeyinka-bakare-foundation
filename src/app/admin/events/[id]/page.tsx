import { redirect } from "next/navigation";

// No separate detail view yet: the edit form is the detail page.
export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/admin/events/${id}/edit`);
}
