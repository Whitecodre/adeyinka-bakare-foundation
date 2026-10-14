-- SAMPLE DATA FOR STYLING ONLY. Not real ABF content.
-- Names, quotes, events and articles below are invented so the public pages
-- (Beneficiaries, Testimonials, Events, News) have something to render.
-- Replace with real records from the admin dashboard before launch, then run
-- sample_public_content_remove.sql to delete everything seeded here.
--
-- Every row is marked so it can be found and removed:
--   beneficiaries / testimonials: text starts with "[SAMPLE]"
--   events / news: slug starts with "sample-"
-- Safe to re-run: events and news upsert by slug; beneficiaries and testimonials
-- are only inserted if no sample rows exist yet.
-- Run the programmes seed (supabase/migrations/20261009_seed_programmes.sql) separately.

begin;

-- ---------- Beneficiaries ----------
insert into public.beneficiaries (full_name, department, level, session, programme, bio, status, featured)
select * from (values
  ('Sample Student One',   'Information Technology', '200 Level', '2025/2026', 'Need-Based Scholarship',  '[SAMPLE] Short biography placeholder for a Need-Based Scholarship beneficiary.', 'published'::public.record_status, true),
  ('Sample Student Two',   'Information Technology', '200 Level', '2025/2026', 'Merit-Based Scholarship', '[SAMPLE] Short biography placeholder for a Merit-Based Scholarship beneficiary.', 'published'::public.record_status, true),
  ('Sample Student Three', 'Information Technology', '300 Level', '2025/2026', 'Internship Programme',    '[SAMPLE] Short biography placeholder for an Internship Programme beneficiary.',    'published'::public.record_status, false),
  ('Sample Student Four',  'Information Technology', '100 Level', '2025/2026', 'Need-Based Scholarship',  '[SAMPLE] Short biography placeholder for a Need-Based Scholarship beneficiary.', 'published'::public.record_status, false),
  ('Sample Student Five',  'Information Technology', '200 Level', '2024/2025', 'Merit-Based Scholarship', '[SAMPLE] Short biography placeholder for a Merit-Based Scholarship beneficiary.', 'published'::public.record_status, false),
  ('Sample Student Six',   'Information Technology', '400 Level', '2024/2025', 'Internship Programme',    '[SAMPLE] Short biography placeholder for an Internship Programme beneficiary.',    'published'::public.record_status, false)
) as v(full_name, department, level, session, programme, bio, status, featured)
where not exists (select 1 from public.beneficiaries where bio like '[SAMPLE]%');

-- ---------- Testimonials (text only; linked to the sample beneficiaries) ----------
insert into public.testimonials (beneficiary_id, content, featured, status)
select b.id, t.content, t.featured, 'published'::public.record_status
from (values
  ('Sample Student One',   '[SAMPLE] A short testimonial placeholder about how the scholarship helped with school fees and focus.', true),
  ('Sample Student Two',   '[SAMPLE] A short testimonial placeholder about being recognised for academic performance.',           true),
  ('Sample Student Three', '[SAMPLE] A short testimonial placeholder about gaining practical industry experience.',               false),
  ('Sample Student Four',  '[SAMPLE] A longer testimonial placeholder, written to show how a multi-sentence quote wraps on a phone screen. It keeps going for a couple of lines so the card layout can be judged with realistic text length.', false)
) as t(name, content, featured)
join public.beneficiaries b on b.full_name = t.name and b.bio like '[SAMPLE]%'
where not exists (select 1 from public.testimonials where content like '[SAMPLE]%');

-- ---------- Events (two upcoming, three past) ----------
insert into public.events (title, slug, description, location, start_at, end_at, status, featured)
values
  ('Sample Orientation Day',       'sample-orientation-day',       '[SAMPLE] Placeholder description for an upcoming orientation event.',          'University of Ilorin', now() + interval '10 days', now() + interval '10 days 3 hours', 'published', true),
  ('Sample Mentorship Session',    'sample-mentorship-session',    '[SAMPLE] Placeholder description for an upcoming mentorship session.',         'Online',               now() + interval '24 days', null,                                   'published', false),
  ('Sample Scholarship Briefing',  'sample-scholarship-briefing',  '[SAMPLE] Placeholder description for a past scholarship briefing.',            'University of Ilorin', now() - interval '20 days', now() - interval '20 days' + interval '2 hours', 'published', false),
  ('Sample Career Talk',           'sample-career-talk',           '[SAMPLE] Placeholder description for a past career talk.',                     'Online',               now() - interval '60 days', null,                                   'published', false),
  ('Sample Awards Ceremony',       'sample-awards-ceremony',       '[SAMPLE] Placeholder description for a past awards ceremony.',                 'University of Ilorin', now() - interval '120 days', null,                                  'published', false)
on conflict (slug) do update set
  title = excluded.title, description = excluded.description, location = excluded.location,
  start_at = excluded.start_at, end_at = excluded.end_at, status = excluded.status, featured = excluded.featured;

-- ---------- News ----------
insert into public.news (title, slug, excerpt, content, status, published_at, featured)
values
  ('Sample News Headline One',   'sample-news-one',   '[SAMPLE] One-sentence summary shown on the news card.', E'[SAMPLE] Article body placeholder.\n\nSecond paragraph, to check spacing and line length on the article page.', 'published', now() - interval '3 days',  true),
  ('Sample News Headline Two',   'sample-news-two',   '[SAMPLE] One-sentence summary shown on the news card.', E'[SAMPLE] Article body placeholder.\n\nSecond paragraph.',                                                         'published', now() - interval '12 days', false),
  ('Sample News Headline Three', 'sample-news-three', '[SAMPLE] One-sentence summary shown on the news card.', E'[SAMPLE] Article body placeholder.\n\nSecond paragraph.',                                                         'published', now() - interval '30 days', false)
on conflict (slug) do update set
  title = excluded.title, excerpt = excluded.excerpt, content = excluded.content,
  status = excluded.status, published_at = excluded.published_at, featured = excluded.featured;

commit;
