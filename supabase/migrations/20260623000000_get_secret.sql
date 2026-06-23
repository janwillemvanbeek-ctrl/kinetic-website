-- ============================================================================
-- get_secret: leest een ontsleuteld geheim uit Supabase Vault.
-- Gebruikt door de Edge Function "generate" om de Mistral API-sleutel op te
-- halen. SECURITY DEFINER zodat alleen deze functie (en niet de aanroeper) bij
-- vault.decrypted_secrets kan. Uitvoerrecht is beperkt tot service_role —
-- anon/authenticated kunnen het geheim dus NIET rechtstreeks opvragen.
-- ============================================================================

create or replace function public.get_secret(secret_name text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  secret_value text;
begin
  select decrypted_secret
    into secret_value
    from vault.decrypted_secrets
   where name = secret_name
   limit 1;
  return secret_value;
end;
$$;

-- Vergrendel de functie: alleen de service_role (Edge Function) mag uitvoeren.
revoke all on function public.get_secret(text) from public;
revoke all on function public.get_secret(text) from anon;
revoke all on function public.get_secret(text) from authenticated;
grant execute on function public.get_secret(text) to service_role;
