import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth/get-user";
import { getProfile } from "@/lib/auth/get-profile";
import type { Profile } from "@/lib/types/domain.types";

export function useAdmin() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdmin() {
      try {
        const userData = await getUser();
        if (!userData) {
          setError("Not authenticated");
          return;
        }

        const profileData = await getProfile(userData.id);
        if (!profileData || profileData.status !== "active") {
          setError("Unauthorized");
          return;
        }

        setUser(userData);
        setProfile(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load admin");
      } finally {
        setLoading(false);
      }
    }

    loadAdmin();
  }, []);

  return { user, profile, loading, error };
}
