create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  request_id text not null unique,
  timestamp timestamptz not null default now(),
  client_id_hash text not null,
  jurisdiction text not null check (jurisdiction in ('india', 'international')),
  lang text not null,
  formulation_type text,
  retrieved_doc_ids text[] not null default '{}',
  cited_doc_ids text[] not null default '{}',
  confidence text,
  abstained boolean not null,
  model text not null,
  latency_ms integer not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  error_code text,
  question_text text,
  answer_text text
);

alter table public.audit_log enable row level security;
revoke all on table public.audit_log from public, anon, authenticated;
grant insert on table public.audit_log to service_role;
grant select, delete on table public.audit_log to service_role;

create index if not exists audit_log_timestamp_idx on public.audit_log (timestamp);
