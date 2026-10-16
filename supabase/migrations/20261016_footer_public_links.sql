-- ============================================================
-- Footer public-page quick links
-- Adds a default set of footer sections and links pointing to
-- the ABF public pages so visitors can navigate the site from
-- the footer even before admins customise anything in /admin.
-- ============================================================

do $$
declare
  v_explore_id      uuid;
  v_news_events_id  uuid;
  v_get_involved_id uuid;
begin
  -- 1. Explore --------------------------------------------------------
  if not exists (select 1 from public.footer_sections where title = 'Explore') then
    insert into public.footer_sections (title, sort_order, is_active)
    values ('Explore', 10, true)
    returning id into v_explore_id;
  else
    select id into v_explore_id from public.footer_sections where title = 'Explore' limit 1;
  end if;

  if not exists (select 1 from public.footer_links where section_id = v_explore_id and url = '/about') then
    insert into public.footer_links (section_id, label, url, sort_order, is_active) values
      (v_explore_id, 'About ABF',         '/about',         10, true),
      (v_explore_id, 'Programmes',        '/programmes',    20, true),
      (v_explore_id, 'Beneficiaries',     '/beneficiaries', 30, true),
      (v_explore_id, 'Testimonials',      '/testimonials',  40, true);
  end if;

  -- 2. News & Events --------------------------------------------------
  if not exists (select 1 from public.footer_sections where title = 'News & Events') then
    insert into public.footer_sections (title, sort_order, is_active)
    values ('News & Events', 20, true)
    returning id into v_news_events_id;
  else
    select id into v_news_events_id from public.footer_sections where title = 'News & Events' limit 1;
  end if;

  if not exists (select 1 from public.footer_links where section_id = v_news_events_id and url = '/news') then
    insert into public.footer_links (section_id, label, url, sort_order, is_active) values
      (v_news_events_id, 'Latest News',  '/news',   10, true),
      (v_news_events_id, 'All Events',   '/events', 20, true);
  end if;

  -- 3. Get Involved ---------------------------------------------------
  if not exists (select 1 from public.footer_sections where title = 'Get Involved') then
    insert into public.footer_sections (title, sort_order, is_active)
    values ('Get Involved', 30, true)
    returning id into v_get_involved_id;
  else
    select id into v_get_involved_id from public.footer_sections where title = 'Get Involved' limit 1;
  end if;

  if not exists (select 1 from public.footer_links where section_id = v_get_involved_id and url = '/get-involved') then
    insert into public.footer_links (section_id, label, url, sort_order, is_active) values
      (v_get_involved_id, 'Become a Member',   '/get-involved/member',   10, true),
      (v_get_involved_id, 'Volunteer with ABF','/get-involved/volunteer',20, true),
      (v_get_involved_id, 'Apply',             '/get-involved',          30, true),
      (v_get_involved_id, 'Contact Us',        '/contact',               40, true);
  end if;
end
$$;
