import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";

// TODO: load the volunteer by id from Supabase and show their sign-up details.
export default function VolunteerDetailPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Volunteer"
        subtitle="Sign-up details"
        backHref="/admin/volunteers"
      />
      <Card className="border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Volunteer details will appear here once the data is connected.
        </p>
      </Card>
    </div>
  );
}
