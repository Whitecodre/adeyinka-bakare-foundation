"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { LoadingState } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Bell, Trash2, Check, Search, Clock, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  user_id?: string;
  created_at: string;
}

export default function NotificationsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual Supabase query
        // const { data, error } = await supabase
        //   .from('notifications')
        //   .select('*')
        //   .order('created_at', { ascending: false });
        // if (error) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setNotifications([]);
      } catch (error) {
        console.error("Error loading notifications:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load notifications",
        });
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [toast]);

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !showUnreadOnly || !notif.read;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      // TODO: Replace with actual Supabase update
      // const { error } = await supabase
      //   .from('notifications')
      //   .update({ read: true })
      //   .eq('id', id);
      // if (error) throw error;

      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
      toast({
        title: "Marked as read",
        description: "Notification marked as read",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark as read",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // TODO: Replace with actual Supabase update
      // const { error } = await supabase
      //   .from('notifications')
      //   .update({ read: true })
      //   .eq('read', false);
      // if (error) throw error;

      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      toast({
        title: "All marked as read",
        description: "All notifications marked as read",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark all as read",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase
      //   .from('notifications')
      //   .delete()
      //   .eq('id', id);
      // if (error) throw error;

      setNotifications(notifications.filter((n) => n.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Deleted",
        description: "Notification deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete notification",
      });
    }
  };

  const handleDeleteAll = async () => {
    try {
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase
      //   .from('notifications')
      //   .delete()
      //   .neq('id', '00000000-0000-0000-0000-000000000000');
      // if (error) throw error;

      setNotifications([]);
      setDeleteConfirm(null);
      toast({
        title: "All deleted",
        description: "All notifications deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete all notifications",
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-700 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const timeAgo = (iso: string): string => {
    const then = new Date(iso).getTime();
    if (!then) return "";
    const s = Math.floor((Date.now() - then) / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  if (loading) {
    return <LoadingState message="Loading notifications..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle={`You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
        actions={
          unreadCount > 0
            ? [
                {
                  label: "Mark All as Read",
                  onClick: handleMarkAllAsRead,
                  variant: "secondary",
                },
              ]
            : undefined
        }
      />

      <Card className="border-[#e9ddd3]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#2d1816]">
              All Notifications ({filteredNotifications.length})
            </CardTitle>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1816]/40" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#e9ddd3]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={showUnreadOnly}
                  onCheckedChange={setShowUnreadOnly}
                />
                <span className="text-sm text-[#2d1816]/60">Unread only</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <EmptyState
              title="No notifications found"
              description={
                searchQuery || showUnreadOnly
                  ? "Try adjusting your filters"
                  : "You're all caught up!"
              }
              icon={Bell}
            />
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => (
                <Card
                  key={notif.id}
                  className={`border-[#e9ddd3] ${
                    !notif.read ? "bg-[#f8c84d]/5" : "bg-[#fffdf8]"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#e9ddd3]/30 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-5 h-5 text-[#2d1816]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-[#2d1816]">
                            {notif.title}
                          </h3>
                          <Badge className={getTypeColor(notif.type)}>
                            {notif.type}
                          </Badge>
                          {!notif.read && (
                            <Badge variant="outline" className="text-xs">
                              Unread
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-[#2d1816]/70 mb-2">
                          {notif.body}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-[#2d1816]/40">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeAgo(notif.created_at)}
                          </span>
                          {notif.user_id && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              System
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!notif.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="hover:bg-[#e9ddd3]/30"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(notif.id)}
                          className="hover:bg-red-100 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {notifications.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#e9ddd3]">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm("all")}
                className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All Notifications
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={() => (deleteConfirm === "all" ? handleDeleteAll() : deleteConfirm && handleDelete(deleteConfirm))}
        title={deleteConfirm === "all" ? "Delete All Notifications?" : "Delete Notification?"}
        description={
          deleteConfirm === "all"
            ? "This action cannot be undone. This will permanently delete all notifications."
            : "This action cannot be undone. This will permanently delete this notification."
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
