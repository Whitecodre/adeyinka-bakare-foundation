import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth/get-user";
import { getUserNotifications, getUnreadNotifications } from "@/lib/services/notifications.service";
import type { Notification } from "@/lib/types/domain.types";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const user = await getUser();
        if (!user) return;

        const [allNotifs, unreadNotifs] = await Promise.all([
          getUserNotifications(user.id),
          getUnreadNotifications(user.id),
        ]);

        setNotifications(allNotifs);
        setUnreadCount(unreadNotifs.length);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  return { notifications, unreadCount, loading };
}
