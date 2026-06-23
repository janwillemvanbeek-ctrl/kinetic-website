-- ============================================================================
-- Rapporttype per dossier: 'advies' of 'expertise'.
-- - expertise: IWMD-vraagstelling + AMA, dossier compleet, persoonlijk onderzoek.
-- - advies: beoordeling op dossier, beantwoordt één specifieke vraagstelling,
--   geen IWMD/AMA, mag op incompleet dossier.
-- ============================================================================

alter table public.dossiers
  add column if not exists rapport_type text not null default 'expertise'
    check (rapport_type in ('advies','expertise'));

-- Specifieke vraag van de opdrachtgever (vooral relevant bij 'advies').
alter table public.dossiers
  add column if not exists vraagstelling text;
