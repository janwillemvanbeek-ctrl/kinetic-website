-- ============================================================================
-- Arts-view (scherm 4): profielen + opslag van arts-invulling.
-- - profiles: koppelt een auth-user aan een weergavenaam/rol, zodat een dossier
--   aan een echte arts-user (toegewezen_aan_id) kan worden toegewezen en de
--   bestaande RLS de arts alleen zijn toegewezen dossiers toont.
-- - dossiers.arts_inputs: door de arts ingevulde secties (jsonb, per veld).
-- - dossiers.terugstuur_notitie: notitie bij "Rapport terugsturen".
-- ============================================================================

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  naam        text,
  rol         text check (rol in ('strateeg','arts')),
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Iedere ingelogde gebruiker mag profielen lezen (naamweergave + arts-keuzelijst).
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (auth.uid() is not null);

-- Je beheert uitsluitend je eigen profiel.
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert with check (id = auth.uid());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Arts-invulling en terugstuurnotitie op het dossier.
alter table public.dossiers add column if not exists arts_inputs jsonb not null default '{}'::jsonb;
alter table public.dossiers add column if not exists terugstuur_notitie text;
