-- ============================================================
-- Role-based row-level security
-- Mirrors lib/auth/permissions.ts so the database enforces the same rules as
-- the API routes (the second layer under them):
--
--   editor       read, create, update
--   admin        read, create, update, delete
--   super_admin  everything, plus the site-level tables below
--
--   Super-admin only (all actions): footer_sections, footer_links,
--   social_links, site_settings.
--
-- Public read policies ("public can read ...") and the public volunteer
-- sign-up policy are not touched. Safe to re-run.
-- ============================================================

-- ---------- Content tables: split "manage" into per-action policies ----------
do $$
declare
  t text;
begin
  foreach t in array array[
    'members', 'volunteers', 'programmes', 'beneficiaries',
    'testimonials', 'events', 'news', 'media', 'contents'
  ]
  loop
    -- the old policy let every admin role do everything, including delete
    execute format('drop policy if exists %I on public.%I', 'admins can manage ' || t, t);
    execute format('drop policy if exists %I on public.%I', 'staff can read ' || t, t);
    execute format('drop policy if exists %I on public.%I', 'staff can create ' || t, t);
    execute format('drop policy if exists %I on public.%I', 'staff can update ' || t, t);
    execute format('drop policy if exists %I on public.%I', 'admins can delete ' || t, t);

    -- any active staff member (super_admin, admin, editor)
    execute format(
      'create policy %I on public.%I for select to authenticated using (public.has_admin_role())',
      'staff can read ' || t, t);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.has_admin_role())',
      'staff can create ' || t, t);
    execute format(
      'create policy %I on public.%I for update to authenticated using (public.has_admin_role()) with check (public.has_admin_role())',
      'staff can update ' || t, t);

    -- delete: admin and super_admin only
    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.has_admin_role(array[''super_admin'',''admin'']::public.user_role[]))',
      'admins can delete ' || t, t);
  end loop;
end
$$;

-- ---------- Site-level tables: super_admin only ----------
drop policy if exists "admins can manage footer sections" on public.footer_sections;
drop policy if exists "super admins can manage footer sections" on public.footer_sections;
create policy "super admins can manage footer sections"
on public.footer_sections for all to authenticated
using (public.has_admin_role(array['super_admin']::public.user_role[]))
with check (public.has_admin_role(array['super_admin']::public.user_role[]));

drop policy if exists "admins can manage footer links" on public.footer_links;
drop policy if exists "super admins can manage footer links" on public.footer_links;
create policy "super admins can manage footer links"
on public.footer_links for all to authenticated
using (public.has_admin_role(array['super_admin']::public.user_role[]))
with check (public.has_admin_role(array['super_admin']::public.user_role[]));

drop policy if exists "admins can manage social links" on public.social_links;
drop policy if exists "super admins can manage social links" on public.social_links;
create policy "super admins can manage social links"
on public.social_links for all to authenticated
using (public.has_admin_role(array['super_admin']::public.user_role[]))
with check (public.has_admin_role(array['super_admin']::public.user_role[]));

drop policy if exists "admins can manage site settings" on public.site_settings;
drop policy if exists "super admins can manage site settings" on public.site_settings;
create policy "super admins can manage site settings"
on public.site_settings for all to authenticated
using (public.has_admin_role(array['super_admin']::public.user_role[]))
with check (public.has_admin_role(array['super_admin']::public.user_role[]));
