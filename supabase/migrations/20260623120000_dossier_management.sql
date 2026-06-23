-- ============================================================================
-- Dossier-management voor de Kinetic tooling.
-- Drie tabellen: dossiers, dossier_documents, dossier_results.
-- Alle inhoud in deze tabellen is reeds gepseudonimiseerd (client-side).
-- RLS: een gebruiker ziet/bewerkt alleen dossiers die hij bezit (owner) of
-- die aan hem zijn toegewezen (toegewezen_aan_id) — bv. de arts (Edwin).
-- ============================================================================

-- ── updated_at trigger-helper ──────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── dossiers ────────────────────────────────────────────────────────────────
create table if not exists public.dossiers (
  id              uuid primary key default gen_random_uuid(),
  zaaknummer      text not null,
  betrokkene      text,                       -- gepseudonimiseerd, bv. [PERSOON-1]
  specialisme     text,                       -- Orthopedisch | Neurologisch | Psychiatrisch | Multidisciplinair
  opdrachtgever   text,
  ongevalsdatum   date,
  status          text not null default 'nieuw'
                    check (status in ('nieuw','voorbereiding','bij_arts','definitief')),
  toegewezen_aan      text,                   -- weergavenaam (bv. "Edwin")
  toegewezen_aan_id   uuid references auth.users (id) on delete set null,
  notities        text,
  owner           uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists dossiers_owner_idx        on public.dossiers (owner);
create index if not exists dossiers_toegewezen_idx    on public.dossiers (toegewezen_aan_id);
create index if not exists dossiers_status_idx        on public.dossiers (status);

drop trigger if exists dossiers_set_updated_at on public.dossiers;
create trigger dossiers_set_updated_at
  before update on public.dossiers
  for each row execute function public.set_updated_at();

-- ── dossier_documents ────────────────────────────────────────────────────────
-- Per (gepseudonimiseerd) brondocument één rij, met een label en statistieken.
create table if not exists public.dossier_documents (
  id           uuid primary key default gen_random_uuid(),
  dossier_id   uuid not null references public.dossiers (id) on delete cascade,
  label        text not null,                 -- bv. "SEH-verslag", "MRI cervicaal"
  content      text not null,                 -- gepseudonimiseerde tekst
  stats        jsonb not null default '{}'::jsonb,  -- {total,bsn,names,dates,contact,orgs}
  char_count   integer not null default 0,
  owner        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at   timestamptz not null default now()
);

create index if not exists dossier_documents_dossier_idx on public.dossier_documents (dossier_id);

-- ── dossier_results ──────────────────────────────────────────────────────────
-- Gegenereerde tijdlijn/rapport-output, met versienummer per type per dossier.
create table if not exists public.dossier_results (
  id           uuid primary key default gen_random_uuid(),
  dossier_id   uuid not null references public.dossiers (id) on delete cascade,
  type         text not null check (type in ('tijdlijn','rapport')),
  payload      jsonb not null,                -- gerenderde data (events / rapport-structuur)
  version      integer not null default 1,
  owner        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at   timestamptz not null default now()
);

create index if not exists dossier_results_dossier_idx on public.dossier_results (dossier_id, type);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.dossiers          enable row level security;
alter table public.dossier_documents enable row level security;
alter table public.dossier_results   enable row level security;

-- Helper: heeft de huidige gebruiker toegang tot dit dossier?
create or replace function public.can_access_dossier(d_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.dossiers d
    where d.id = d_id
      and (d.owner = auth.uid() or d.toegewezen_aan_id = auth.uid())
  );
$$;

-- dossiers: eigenaar of toegewezene mag lezen/bewerken; alleen eigenaar mag verwijderen.
drop policy if exists dossiers_select on public.dossiers;
create policy dossiers_select on public.dossiers
  for select using (owner = auth.uid() or toegewezen_aan_id = auth.uid());

drop policy if exists dossiers_insert on public.dossiers;
create policy dossiers_insert on public.dossiers
  for insert with check (owner = auth.uid());

drop policy if exists dossiers_update on public.dossiers;
create policy dossiers_update on public.dossiers
  for update using (owner = auth.uid() or toegewezen_aan_id = auth.uid())
  with check (owner = auth.uid() or toegewezen_aan_id = auth.uid());

drop policy if exists dossiers_delete on public.dossiers;
create policy dossiers_delete on public.dossiers
  for delete using (owner = auth.uid());

-- dossier_documents: toegang volgt het bovenliggende dossier.
drop policy if exists dossier_documents_all on public.dossier_documents;
create policy dossier_documents_all on public.dossier_documents
  for all using (public.can_access_dossier(dossier_id))
  with check (public.can_access_dossier(dossier_id));

-- dossier_results: idem.
drop policy if exists dossier_results_all on public.dossier_results;
create policy dossier_results_all on public.dossier_results
  for all using (public.can_access_dossier(dossier_id))
  with check (public.can_access_dossier(dossier_id));
