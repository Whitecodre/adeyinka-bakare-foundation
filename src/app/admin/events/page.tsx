"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ResourceList } from "@/components/admin/resource-list";
import { StatusBadge, FeaturedBadge } from "@/components/admin/status-badge";
import { Toolbar } from "@/components/admin/toolbar";
import { ListSkeleton } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/admin/page-header";

interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  location?: string;
  start_at: string;
  end_at: string;
  image?: string;
  status: "draft" | "published" | "cancelled" | "archived";
  featured: boolean;
  created_at: string;
}

export default function EventsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/events");
        const result = await response.json();

        if (result.success) {
          setEvents(result.data);
        } else {
          throw new Error(result.error || "Failed to load events");
        }
      } catch (error) {
        console.error("Error loading events:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load events",
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [toast]);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setEvents(events.filter((e) => e.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete event",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Events"
        subtitle="Manage foundation events"
        actions={[{ label: "Add Event", onClick: () => router.push("/admin/events/new"), variant: "primary" }]}
      />

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              All Events ({filteredEvents.length})
            </CardTitle>
            <Toolbar search={searchQuery} onSearchChange={setSearchQuery} placeholder="Search events..." className="w-full sm:w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListSkeleton rows={4} />
          ) : filteredEvents.length === 0 ? (
            <EmptyState
              title="No events found"
              description={searchQuery ? "Try a different search term" : "Get started by adding your first event"}
              action={
                !searchQuery ? {
                  label: "Add Event",
                  onClick: () => router.push("/admin/events/new")
                } : undefined
              }
              icon={Calendar}
            />
          ) : (
            <ResourceList
              rows={filteredEvents}
              getKey={(r) => r.id}
              getName={(r) => r.title}
              icon={Calendar}
              columns={[
                { header: "Title", cell: (r) => (<div className="flex items-center gap-2 font-medium text-foreground">{r.featured && <FeaturedBadge />}{r.title}</div>) },
                { header: "Location", cell: (r) => r.location || "-", className: "text-muted-foreground" },
                { header: "Start Date", cell: (r) => formatDate(r.start_at), className: "text-muted-foreground" },
                { header: "End Date", cell: (r) => formatDate(r.end_at), className: "text-muted-foreground" },
                { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
              ]}
              title={(r) => r.title}
              badges={(r) => (<>{r.featured && <FeaturedBadge />}<StatusBadge status={r.status} /></>)}
              meta={(r) => (<>
                  {r.location && (<p className="flex items-center gap-1.5"><MapPin className="size-3.5" />{r.location}</p>)}
                  <p className="flex items-center gap-1.5"><Clock className="size-3.5" />{formatDate(r.start_at)} - {formatDate(r.end_at)}</p>
                </>)}
              onEdit={(r) => router.push(`/admin/events/${r.id}/edit`)}
              onDelete={(r) => setDeleteConfirm(r.id)}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Event?"
        description="This action cannot be undone. This will permanently delete the event from the database."
        confirmLabel="Delete"
        destructive
        cancelLabel="Cancel"
      />
    </div>
  );
}
