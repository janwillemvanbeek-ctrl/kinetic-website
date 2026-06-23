-- ============================================================================
-- Tijdelijke vereenvoudiging: elke INGELOGDE gebruiker heeft volledige toegang
-- tot alle dossiers/documenten/resultaten. Bedoeld voor de twee vertrouwde
-- gebruikers (Jan-Willem + Edwin) tijdens de pilot.
-- RLS blijft aan (anon zonder JWT heeft géén toegang).
-- LATER terug te zetten naar owner/toegewezene-isolatie (zie
-- 20260623120000_dossier_management.sql).
-- ============================================================================

-- dossiers: vervang de eigenaar/toegewezene-policies door één open policy.
drop policy if exists dossiers_select on public.dossiers;
drop policy if exists dossiers_insert on public.dossiers;
drop policy if exists dossiers_update on public.dossiers;
drop policy if exists dossiers_delete on public.dossiers;
drop policy if exists dossiers_all    on public.dossiers;
create policy dossiers_all on public.dossiers
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- dossier_documents
drop policy if exists dossier_documents_all on public.dossier_documents;
create policy dossier_documents_all on public.dossier_documents
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- dossier_results
drop policy if exists dossier_results_all on public.dossier_results;
create policy dossier_results_all on public.dossier_results
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
