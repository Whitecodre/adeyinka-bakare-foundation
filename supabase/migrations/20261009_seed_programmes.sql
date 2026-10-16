-- Seed: the four flagship programmes from Article 5 of the ABF Constitution.
-- Wording is taken from the constitution (docs/ABF_Details.md, Section 5.2).
-- Safe to re-run: existing rows (matched by slug) are updated, not duplicated.

begin;

insert into public.programmes (title, slug, description, status, featured)
values
  (
    'Need-Based Scholarship',
    'need-based-scholarship',
    'The Need-Based Scholarship provides financial assistance to members who demonstrate genuine financial need. The programme aims to reduce financial barriers and enable beneficiaries to focus on their academic pursuits. Open to registered ABF members in 100 level and 200 level of the Department of Information Technology.',
    'published',
    true
  ),
  (
    'Merit-Based Scholarship',
    'merit-based-scholarship',
    'The Merit-Based Scholarship recognizes and rewards outstanding academic performance among members of the Fellowship. Open to registered ABF members in 200 level of the Department of Information Technology who meet the academic performance requirements established by the Fellowship.',
    'published',
    true
  ),
  (
    'Internship Programme',
    'internship-programme',
    'The Internship Programme is designed to provide practical industry exposure and professional experience to members, enabling them to develop workplace competencies before graduation. Open to registered ABF members in 300 level of the Department of Information Technology.',
    'published',
    true
  ),
  (
    'Mentorship Programme',
    'mentorship-programme',
    'The Mentorship Programme is designed to prepare final-year students for life after graduation by connecting them with experienced professionals and mentors. It may include career guidance, professional development, leadership coaching, CV and interview preparation, networking opportunities and industry mentorship. Open to registered ABF members in 400 level of the Department of Information Technology.',
    'published',
    true
  )
on conflict (slug) do update
  set title = excluded.title,
      description = excluded.description,
      status = excluded.status,
      featured = excluded.featured,
      updated_at = now();

commit;
