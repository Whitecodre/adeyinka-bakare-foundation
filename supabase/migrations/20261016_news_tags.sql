alter table public.news
  add column if not exists tags text[] not null default '{}';

create index if not exists idx_news_tags on public.news using gin (tags);
