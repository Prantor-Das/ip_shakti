create schema if not exists extensions;
create extension if not exists vector with schema extensions;
create extension if not exists pgcrypto;

create table if not exists public.corpus_documents (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  jurisdiction text not null check (jurisdiction in ('india', 'international')),
  instrument_type text not null check (instrument_type in ('act', 'rules', 'treaty', 'regulation', 'notification', 'guideline', 'case-law', 'pharmacopoeia', 'registry-info')),
  citation_label text not null,
  version text not null,
  as_of_date date not null,
  source_url text not null,
  checksum text not null,
  status text not null default 'active' check (status in ('active', 'superseded')),
  ingested_at timestamptz not null default now(),
  unique (slug, checksum)
);

create index if not exists corpus_documents_slug_status_idx on public.corpus_documents (slug, status);

create table if not exists public.corpus_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.corpus_documents(id) on delete restrict,
  jurisdiction text not null check (jurisdiction in ('india', 'international')),
  section_ref text,
  heading text,
  content text not null,
  chunk_index integer not null,
  embedding extensions.vector(768) not null,
  content_tsv tsvector generated always as (to_tsvector('simple', content)) stored,
  unique (document_id, chunk_index)
);

create index if not exists corpus_chunks_embedding_hnsw_idx on public.corpus_chunks using hnsw (embedding extensions.vector_cosine_ops);
create index if not exists corpus_chunks_jurisdiction_idx on public.corpus_chunks (jurisdiction);
create index if not exists corpus_chunks_content_gin_idx on public.corpus_chunks using gin (content_tsv);

alter table public.corpus_documents enable row level security;
alter table public.corpus_chunks enable row level security;

revoke all on table public.corpus_documents, public.corpus_chunks from public, anon, authenticated;
grant all on table public.corpus_documents, public.corpus_chunks to service_role;

create or replace function public.match_chunks(
  query_embedding extensions.vector(768),
  p_jurisdiction text,
  p_count integer,
  p_min_similarity double precision
)
returns table (
  id uuid,
  document_id uuid,
  jurisdiction text,
  section_ref text,
  heading text,
  content text,
  chunk_index integer,
  similarity double precision,
  title text,
  citation_label text,
  version text,
  as_of_date date,
  source_url text
)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select
    c.id,
    c.document_id,
    c.jurisdiction,
    c.section_ref,
    c.heading,
    c.content,
    c.chunk_index,
    1 - (c.embedding <=> query_embedding) as similarity,
    d.title,
    d.citation_label,
    d.version,
    d.as_of_date,
    d.source_url
  from public.corpus_chunks c
  join public.corpus_documents d on d.id = c.document_id
  where d.status = 'active'
    and c.jurisdiction = p_jurisdiction
    and d.jurisdiction = p_jurisdiction
    and 1 - (c.embedding <=> query_embedding) >= p_min_similarity
  order by c.embedding <=> query_embedding
  limit greatest(0, least(p_count, 100));
$$;

revoke all on function public.match_chunks(extensions.vector(768), text, integer, double precision) from public, anon, authenticated;
grant execute on function public.match_chunks(extensions.vector(768), text, integer, double precision) to service_role;
