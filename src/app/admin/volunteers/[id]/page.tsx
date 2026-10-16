"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Mail, Phone, GraduationCap, Heart, MessageSquare, CalendarDays } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { ErrorState } from "@/components/admin/error-state";
import { FormField } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  department: string | null;
  level: string | null;
  interest: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

const STATUSES = ["new", "contacted", "accepted", "rejected", "archived"] as const;

function Detail({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">
        <Icon />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="mt-0.5 break-words text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}

export default function VolunteerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/volunteers/${id}`);
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.error ?? "Could not load this volunteer");
      setVolunteer(body.data);
      setStatus(body.data.status);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load this volunteer");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveStatus() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/volunteers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.error ?? "Could not update the status");
      setVolunteer(body.data);
      toast({ title: "Status updated", description: `Marked as ${status}.` });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: e instanceof Error ? e.message : "Could not update the status",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title={volunteer?.full_name ?? "Volunteer"} subtitle="Sign-up details" backHref="/admin/volunteers" />

      {loading ? (
        <Card className="space-y-4 border-border bg-card p-6">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </Card>
      ) : error || !volunteer ? (
        <ErrorState description={error ?? "Volunteer not found"} onRetry={load} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="space-y-6 border-border bg-card p-5 md:p-6 lg:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-foreground">{volunteer.full_name}</h2>
              <StatusBadge status={volunteer.status} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Detail icon={Mail} label="Email">
                <a href={`mailto:${volunteer.email}`} className="text-primary hover:underline">
                  {volunteer.email}
                </a>
              </Detail>
              <Detail icon={Phone} label="Phone">
                {volunteer.phone ? (
                  <a href={`tel:${volunteer.phone}`} className="text-primary hover:underline">
                    {volunteer.phone}
                  </a>
                ) : (
                  "Not given"
                )}
              </Detail>
              <Detail icon={GraduationCap} label="Department and level">
                {[volunteer.department, volunteer.level].filter(Boolean).join(" · ") || "Not given"}
              </Detail>
              <Detail icon={Heart} label="Area of interest">
                {volunteer.interest || "Not given"}
              </Detail>
              <Detail icon={CalendarDays} label="Signed up">
                {new Date(volunteer.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Detail>
            </div>

            {volunteer.message && (
              <Detail icon={MessageSquare} label="Message">
                <p className="whitespace-pre-wrap leading-relaxed">{volunteer.message}</p>
              </Detail>
            )}
          </Card>

          <Card className="h-fit space-y-4 border-border bg-card p-5 md:p-6">
            <FormField label="Status" htmlFor="volunteer-status" hint="Track where this sign-up is in your follow-up.">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="volunteer-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <Button
              variant="brand"
              className="h-11 w-full sm:h-10"
              loading={saving}
              disabled={status === volunteer.status}
              onClick={saveStatus}
            >
              Save status
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
