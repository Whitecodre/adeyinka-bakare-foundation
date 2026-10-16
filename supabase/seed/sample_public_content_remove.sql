-- Removes everything added by sample_public_content.sql (and nothing else).
begin;
delete from public.testimonials  where content like '[SAMPLE]%';
delete from public.beneficiaries where bio like '[SAMPLE]%';
delete from public.events        where slug like 'sample-%';
delete from public.news          where slug like 'sample-%';
commit;
