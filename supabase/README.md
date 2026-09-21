# Supabase database setup

The canonical schema is the versioned migration:

`supabase/migrations/202609210001_corpus.sql`

It creates the `vector` and `pgcrypto` extensions, `corpus_documents`,
`corpus_chunks`, the HNSW/BTREE/GIN indexes, RLS, and the `match_chunks`
RPC. There are intentionally no anonymous or authenticated read policies;
the server-only service-role client is the only application reader/writer.

## Apply it

The repository includes the Supabase CLI, so a global `supabase` install is not
required. Authenticate and link the project once:

```bash
pnpm supabase login
pnpm supabase link --project-ref <your-project-ref>
pnpm supabase db push
pnpm db:check
```

The project ref is the hostname prefix in `SUPABASE_URL`, for example
`https://abc123.supabase.co` has project ref `abc123`. If you already have a
database connection string instead, use `pnpm supabase db push --db-url ...`.

`SUPABASE_SERVICE_ROLE_KEY` must be the server-only `service_role`/secret key
from Project Settings > API. Do not put a `sb_publishable_...` or anon key in
that variable; those keys are intentionally denied access to the corpus tables.

Or paste the migration into the Supabase SQL editor. For future schema
changes, add a new timestamped SQL file under `supabase/migrations/`; do not
edit an already-applied migration. The repository migration remains the
manual source of truth and can be reviewed before applying.

## Verify manually

```sql
select extname from pg_extension where extname in ('vector', 'pgcrypto');
select schemaname, tablename, rowsecurity
from pg_tables
where tablename in ('corpus_documents', 'corpus_chunks');
select routine_schema, routine_name
from information_schema.routines
where routine_name = 'match_chunks';
```

Use the Supabase dashboard’s table editor while signed out or with the anon
key to verify that both corpus tables return no rows. The service-role key
must remain server-only and must never be prefixed with `NEXT_PUBLIC_`.
