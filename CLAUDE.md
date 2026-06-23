# Kinetic Medische Expertises — Project Context

## Wat is dit
Website voor kineticmedical.nl. Medische expertises in letselschade, AI-ondersteund. Gehost op GitHub Pages.

## Repo structuur
- `index.html` — Homepage
- `tooling-demo.html` — Demo 1: Pseudonymizer (client-side BSN/IBAN/medische termen detectie)
- `tijdlijn-demo.html` — Demo 2: Tijdlijn Extractie (chronologische reconstructie uit dossier)
- `rapport-demo.html` — Demo 3: Concept Rapport (IWMD expertiserapport generator)
- `kinetic.css` — Shared site CSS (homepage e.d.)
- `kinetic.js` — Shared site JS (homepage e.d.)
- `assets/` — Afbeeldingen en logo's
- `assets/demo/` — Gedeelde + per-demo CSS/JS voor de drie demo's (zie Demo-architectuur)
- `supabase/functions/generate/` — Edge Function: Mistral-proxy voor de AI-demo's
- `supabase/migrations/` — o.a. `get_secret` RPC (Vault-uitlezing)
- `tooling/` — Tooling subpagina's

### Demo-architectuur (`assets/demo/`)
De drie demo-HTML's zijn dunne shells: alleen hero + demo-markup + `how`-sectie.
Header, pipeline en footer worden client-side geïnjecteerd door `layout.js`.
- `base.css` — gedeelde basis-stijl (layout, header, footer, pipeline, knoppen, hero, demo-omhulsel, mode-toggle, invoerpaneel)
- `layout.js` — gedeeld HTML-template: injecteert header/pipeline/footer in `<div data-kinetic="...">` placeholders; actieve pipeline-stap via `<body data-kinetic-step="1|2|3">`. Exposeert `Kinetic.esc`.
- `tooling-demo.css` / `.js` — Pseudonymizer (demo-specifiek)
- `tijdlijn-demo.css` / `.js` — Tijdlijn Extractie (demo-specifiek)
- `rapport-demo.css` / `.js` — Concept Rapport (demo-specifiek)
Categorie-kleuren (`--c-*`) staan per demo in de demo-CSS; de gedeelde palette staat in `base.css`.

## Deploy
Push naar `main` branch → GitHub Pages deployt automatisch naar kineticmedical.nl.
DNS via Exonet. CNAME record in repo.

## Design system
- Merknaam: "Kinetic." (met punt)
- Primaire kleur: Warm Teal #2F6F6A (alleen als accent, nooit decoratief)
- Achtergrond: Paper #F7F3EA
- Tekst: Ink #1A1916
- Stone (secundair): #8B8579
- Fog (licht grijs): #EDEAE4
- Line (border): #D8D4CC
- Typografie: Inter (body), IBM Plex Mono (data/code)
- Amber accent voor arts-secties: #E8A838 (spaarzaam)
- Rode accent voor hiaten/fouten: #D94F4F

## Demo pagina structuur
Alle drie de demo's delen dezelfde structuur. Header, pipeline en footer komen
uit `assets/demo/layout.js` (één bron); de rest staat in de demo-HTML zelf:
- Header met "Kinetic." logo (geïnjecteerd)
- Hero sectie met titel en uitleg
- Pipeline (3 stappen: Pseudonymizer → Tijdlijn → Rapport, met links; geïnjecteerd)
- Mode toggle (Voorbeelddossier / Eigen tekst AI)
- Demo content area
- "Hoe werkt dit?" uitleg sectie
- Footer (geïnjecteerd)

## Technische details

### Pseudonymizer (tooling-demo.html)
- Volledig client-side, geen API calls
- BSN elfproef validatie
- IBAN modulo 97 validatie
- 100+ medische termen detectie (namen, medicatie, organisaties)
- Vervangt door [PERSOON-N], [ORGANISATIE-N], [ADRES-N] etc.

### AI-backend (tijdlijn + rapport)
- Provider: **Mistral** (`mistral-large-latest`) via de Supabase Edge Function
  `generate` — NIET Claude/Anthropic (zie Privacy en API-provider).
- Browser → `POST {SUPABASE_URL}/functions/v1/generate` met body
  `{ type:"tijdlijn"|"rapport", text, systemPrompt }`; antwoord `{ content }`.
- Frontend roept dit aan via `Kinetic.generate(type, text, systemPrompt)` in
  `assets/demo/layout.js`. Geen API-sleutel of modelnaam in de frontend.
- De Edge Function haalt de Mistral-sleutel uit Supabase Vault (`get_secret`
  RPC) en zet CORS voor kineticmedical.nl. Sleutel verlaat de server nooit.
- `response_format: json_object` dwingt geldige JSON af; frontend houdt zijn
  JSON-opschoning als vangnet.
- Setup/deploy: zie `supabase/functions/generate/README.md`.

### Tijdlijn (tijdlijn-demo.html)
- Voorbeeldmodus: hardcoded whiplash-casus tijdlijn
- AI-modus: Mistral via Edge Function `generate` (type "tijdlijn", max_tokens 8000)
- Toont chronologische events met bron, datum, type badge

### Concept Rapport (rapport-demo.html)
- Meest complexe demo
- Voorbeeldmodus: volledig IWMD orthopedisch rapport
- AI-modus: Mistral via Edge Function `generate` (type "rapport", max_tokens 16000)
- Features: dossiercompleetheidscore, geprioriteerde hiaten (kritiek/belangrijk/wenselijk),
  tegenstrijdigheden met severity, arts-templates met dossiercontext,
  officiële IWMD-vraagstelling, AMA Guides chapter-verwijzingen, bronnenlijst
- JSON parsing met robuuste cleaner (trailing commas, control chars, newlines)

## Stijlregels
- Geen emoji in UI
- Korte declaratieve zinnen
- "je" niet "jullie"
- Toon: klinisch professioneel, geen marketing-taal
- Disclaimer altijd zichtbaar: "AI ondersteunt bij ordening; de BIG-geregistreerde specialist autoriseert"

## Privacy en API-provider
KRITIEK: Kinetic verwerkt medische dossiers (bijzondere persoonsgegevens, AVG art. 9).
- Productie-provider is **Mistral** (EU-based, DPA beschikbaar) — NIET Claude/Anthropic.
- Pseudonimisering gebeurt ALTIJD client-side VÓÓR data naar een API gaat.
- Mistral-sleutel staat in Supabase Vault, NOOIT in frontend of Git.
- Architectuur: browser (pseudonimisering) → Edge Function `generate` → Mistral → response.
  De Edge Function haalt de sleutel uit Vault; de frontend stuurt alleen gepseudonimiseerde tekst.

## Bekende issues
- AI-modus vereist dat de Edge Function `generate` gedeployed is én het secret `MISTRAL_API_KEY` in Vault staat (zie `supabase/functions/generate/README.md`)
- Bij grote dossiers kan JSON parsing falen — antwoord kan afgekapt worden (Edge Function geeft dan een 413-melding)
- Header/footer/pipeline worden via JS geïnjecteerd; zonder JavaScript tonen de demo's geen chrome (acceptabel — de demo's vereisen JS)

## Niet aanpassen zonder overleg
- IWMD-vraagstelling (is officiële tekst)
- AMA Guides chapter-verwijzingen
- Pseudonymizer regex patronen (zijn gevalideerd)
- Kleurenpalet en typografie
