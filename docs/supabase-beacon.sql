create table if not exists public.beacon_heartbeats (
  key text primary key,
  last_ping_at timestamptz not null default now(),
  last_source text
);

alter table public.beacon_heartbeats enable row level security;

-- No RLS policy is needed if you only write using the Supabase service role key
-- (service role bypasses RLS). If you want to allow authenticated users to read
-- it, add a read policy:
-- create policy "read own heartbeat"
-- on public.beacon_heartbeats
-- for select
-- to authenticated
-- using (true);

