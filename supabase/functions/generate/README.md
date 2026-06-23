# Edge Function: `generate`

Server-side proxy naar Mistral voor de AI-demo's (tijdlijn + rapport). De
Mistral-sleutel komt uit Supabase Vault en verlaat de server nooit; de browser
stuurt alleen gepseudonimiseerde tekst.

## Contract

`POST /functions/v1/generate`

```json
{ "type": "tijdlijn" | "rapport", "text": "<gepseudonimiseerd dossier>", "systemPrompt": "<instructies>" }
```

Antwoord: `{ "content": "<JSON-string van het model>" }` (of `{ "error": "..." }`).

De frontend roept dit aan via `Kinetic.generate(type, text, systemPrompt)` in
`assets/demo/layout.js`.

## Eenmalige setup

1. **Mistral-sleutel in Vault** (Supabase Dashboard → Project Settings → Vault,
   of via SQL):
   ```sql
   select vault.create_secret('<MISTRAL_API_KEY>', 'MISTRAL_API_KEY');
   ```
2. **RPC `get_secret`** — wordt aangemaakt door de migration:
   ```
   supabase db push        # past supabase/migrations/*_get_secret.sql toe
   ```
   (Alternatief: draai de SQL handmatig in de SQL Editor.)
3. **Deploy de functie**:
   ```
   supabase functions deploy generate
   ```
   `SUPABASE_URL` en `SUPABASE_SERVICE_ROLE_KEY` worden automatisch geïnjecteerd.

   Alternatief voor Vault: zet de sleutel als function-secret, dan slaat de
   functie de Vault-stap over:
   ```
   supabase secrets set MISTRAL_API_KEY=<...>
   ```

## CORS

Toegestane origins staan in `index.ts` (`ALLOWED_ORIGINS`): `kineticmedical.nl`
en `www.kineticmedical.nl`. Voeg hier extra origins toe (bijv. een
staging-domein) indien nodig.

## Opmerkingen

- `verify_jwt` staat standaard aan; de frontend stuurt de anon-key als Bearer,
  dat volstaat. De demo's vereisen geen ingelogde gebruiker.
- `response_format: json_object` dwingt geldige JSON af; de frontend houdt zijn
  bestaande JSON-opschoning als vangnet.
- De Mistral-sleutel zit alléén in Vault/secrets, nooit in frontend of Git.
