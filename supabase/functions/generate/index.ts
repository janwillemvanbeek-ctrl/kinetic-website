// ============================================================================
// Supabase Edge Function: generate
// ----------------------------------------------------------------------------
// Server-side proxy naar de Mistral API voor de Kinetic-demo's (tijdlijn +
// rapport). De Mistral API-sleutel komt uit Supabase Vault en verlaat NOOIT
// de server: de browser stuurt alleen gepseudonimiseerde tekst hierheen.
//
// Request (POST, JSON):
//   { "type": "tijdlijn" | "rapport", "text": "...", "systemPrompt": "..." }
//
// Response (JSON):
//   { "content": "<ruwe model-output, verwacht JSON-string>" }   // 200
//   { "error": "<melding>" }                                      // 4xx/5xx
//
// Deploy:  supabase functions deploy generate
// Vault:   secret "MISTRAL_API_KEY" moet bestaan (zie migration get_secret).
// ============================================================================

import { createClient } from "jsr:@supabase/supabase-js@2";

const MISTRAL_ENDPOINT = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_MODEL = "mistral-large-latest";

// Tokens per demo-type (was: Anthropic max_tokens 8000 / 16000).
const MAX_TOKENS: Record<string, number> = {
  tijdlijn: 8000,
  rapport: 16000,
};

// Alleen de productie-origins mogen de demo's vanuit de browser aanroepen.
const ALLOWED_ORIGINS = [
  "https://kineticmedical.nl",
  "https://www.kineticmedical.nl",
];

function corsHeaders(origin: string): Record<string, string> {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

// Mistral-sleutel uit Vault. Primair via env (function secret), anders via de
// SECURITY DEFINER RPC public.get_secret die vault.decrypted_secrets uitleest.
async function getMistralKey(): Promise<string> {
  const envKey = Deno.env.get("MISTRAL_API_KEY");
  if (envKey) return envKey;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
  const { data, error } = await supabase.rpc("get_secret", {
    secret_name: "MISTRAL_API_KEY",
  });
  if (error) throw new Error("Vault-fout: " + error.message);
  if (!data) throw new Error("Mistral API-sleutel niet gevonden in Vault.");
  return data as string;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("Origin") ?? "";
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }
  if (req.method !== "POST") {
    return json({ error: "Alleen POST toegestaan." }, 405, cors);
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body) return json({ error: "Ongeldige JSON-body." }, 400, cors);

    const { type, text, systemPrompt } = body as {
      type?: string;
      text?: string;
      systemPrompt?: string;
    };

    if (type !== "tijdlijn" && type !== "rapport") {
      return json(
        { error: "Veld 'type' moet 'tijdlijn' of 'rapport' zijn." },
        400,
        cors,
      );
    }
    if (typeof text !== "string" || !text.trim()) {
      return json({ error: "Veld 'text' ontbreekt of is leeg." }, 400, cors);
    }
    if (typeof systemPrompt !== "string" || !systemPrompt.trim()) {
      return json(
        { error: "Veld 'systemPrompt' ontbreekt of is leeg." },
        400,
        cors,
      );
    }

    const apiKey = await getMistralKey();

    const resp = await fetch(MISTRAL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        max_tokens: MAX_TOKENS[type],
        // Forceer geldige JSON-output (Mistral structured output).
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      return json(
        { error: "Mistral API-fout " + resp.status + ": " + detail },
        502,
        cors,
      );
    }

    const data = await resp.json();
    const choice = data?.choices?.[0];
    const content = choice?.message?.content ?? "";
    if (!content) {
      return json({ error: "Leeg antwoord van Mistral." }, 502, cors);
    }
    if (choice?.finish_reason === "length") {
      return json(
        {
          error:
            "Het dossier is te groot voor een enkele aanroep (antwoord afgekapt). Probeer een korter dossier.",
        },
        413,
        cors,
      );
    }

    return json({ content }, 200, cors);
  } catch (e) {
    return json({ error: (e as Error).message }, 500, cors);
  }
});
