"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { can, requirementForPath, type Action, type Resource } from "@/lib/auth/permissions";

export interface Account {
  name: string;
  email: string;
  role: string;
}

interface AccountContextValue {
  /** null until the profile has loaded (or when nobody is signed in). */
  account: Account | null;
  loading: boolean;
  can: (resource: Resource, action: Action) => boolean;
  /** Can this role do `action` on the page it is currently looking at? */
  canHere: (action: Action) => boolean;
}

const AccountContext = createContext<AccountContextValue | null>(null);

/** Loads the signed-in admin once and shares it with the header, sidebar and lists. */
export function AccountProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) {
        if (!cancelled) setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();
      if (cancelled) return;
      setAccount({
        name: profile?.full_name ?? user.email ?? "Admin",
        email: user.email ?? "",
        role: profile?.role ?? "",
      });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AccountContextValue>(
    () => ({
      account,
      loading,
      can: (resource, action) => can(account?.role, resource, action),
      canHere: (action) => {
        const needs = requirementForPath(pathname);
        return needs ? can(account?.role, needs.resource, action) : true;
      },
    }),
    [account, loading, pathname],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside <AccountProvider>");
  return ctx;
}
