/* ==========================================================================
   Kinetic demo's — gedeeld HTML-template (header / pipeline / footer)
   Eén bron voor de chrome rond elke demo. GitHub Pages is statisch, dus de
   markup wordt client-side geïnjecteerd in placeholder-elementen:

     <div data-kinetic="header"></div>
     <div data-kinetic="pipeline"></div>
     <div data-kinetic="footer"></div>

   De actieve pipeline-stap volgt uit <body data-kinetic-step="1|2|3">.
   Exposeert tevens een kleine util-namespace (Kinetic.esc) voor de demo-JS.
   ========================================================================== */
(function () {
  "use strict";

  var STEPS = [
    { n: 1, label: "Pseudonymizer", href: "tooling-demo.html" },
    { n: 2, label: "Tijdlijn Extract", href: "tijdlijn-demo.html" },
    { n: 3, label: "Concept Rapport", href: "rapport-demo.html" }
  ];

  // Woordmerk "Kinetic." conform de homepage (tekst, geen SVG-badge).
  // Op de donkere demo-header/footer: witte tekst met teal punt.
  function logoWordmark() {
    return '<span style="font-family:\'Inter\',sans-serif;font-weight:600;font-size:1.3rem;letter-spacing:-.01em;color:#FAF9F7;">' +
      'Kinetic<span style="color:#5FB3A6;">.</span></span>';
  }

  function headerHTML() {
    return '<header class="header">' +
      '<nav class="nav-content">' +
      '<a href="https://kineticmedical.nl" class="logo">' + logoWordmark() + '</a>' +
      '<div class="nav-links">' +
      '<a href="https://kineticmedical.nl/#proces">Werkwijze</a>' +
      '<a href="https://kineticmedical.nl/#voordelen">Voordelen</a>' +
      '<a href="https://kineticmedical.nl/#faq">FAQ</a>' +
      '<a href="https://kineticmedical.nl/#prijzen">Prijzen</a>' +
      '<a href="https://kineticmedical.nl/#contact" class="btn btn-primary">Plan een gesprek</a>' +
      '</div></nav></header>';
  }

  function pipelineHTML(active) {
    var row = STEPS.map(function (step) {
      var isActive = step.n === active;
      var cls = isActive ? "pipe-step active" : "pipe-step done";
      var tag = isActive ? "Actief" : "Gereed";
      var inner = '<span class="pipe-num">' + step.n + '</span>' +
        '<span class="pipe-label">' + step.label + '</span>' +
        '<span class="pipe-tag">' + tag + '</span>';
      // Actieve stap = huidige pagina (geen link); overige stappen wel.
      return isActive
        ? '<div class="' + cls + '">' + inner + '</div>'
        : '<a href="' + step.href + '" class="' + cls + '">' + inner + '</a>';
    }).join('<div class="pipe-connector"></div>');
    return '<div class="pipe"><div class="pipe-row">' + row + '</div></div>';
  }

  function footerHTML() {
    var year = new Date().getFullYear();
    return '<footer class="footer">' +
      '<div class="footer-content">' +
      '<div class="footer-brand">' + logoWordmark() +
      '<p>Geautomatiseerde dossiervoorbereiding voor medische expertises. Sneller, nauwkeuriger, compliant.</p>' +
      '</div>' +
      '<div class="footer-links">' +
      '<h4>Contact</h4>' +
      '<a href="mailto:info@kineticmedical.nl">info@kineticmedical.nl</a>' +
      '<a href="tel:0852502747">085 250 2747</a>' +
      '</div>' +
      '<div class="footer-links">' +
      '<h4>Juridisch</h4>' +
      '<a href="tooling-demo.html">Pseudonymizer demo</a>' +
      '<a href="tijdlijn-demo.html">Tijdlijn demo</a>' +
      '<a href="rapport-demo.html">Rapport demo</a>' +
      '<a href="https://kineticmedical.nl/privacy">Privacybeleid</a>' +
      '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
      '<p>&copy; ' + year + ' Kinetic Medische Expertises</p>' +
      '<span>SSL beveiligd</span>' +
      '</div></footer>';
  }

  function fill(name, html) {
    var el = document.querySelector('[data-kinetic="' + name + '"]');
    if (el) el.outerHTML = html;
  }

  function init() {
    var active = parseInt(document.body.getAttribute("data-kinetic-step"), 10) || 0;
    fill("header", headerHTML());
    fill("pipeline", pipelineHTML(active));
    fill("footer", footerHTML());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Gedeelde util voor de demo-scripts.
  window.Kinetic = window.Kinetic || {};
  window.Kinetic.esc = function (s) {
    if (!s) return "";
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  };

  // ── AI-backend ──────────────────────────────────────────────────────────
  // De AI-demo's (tijdlijn + rapport) lopen via de Supabase Edge Function
  // "generate", die server-side Mistral aanroept. Geen API-sleutel of model
  // in de frontend. Supabase-config hergebruikt uit de tooling-app.
  window.Kinetic.SUPABASE_URL = "https://nzetoeewvnznoyuhdiga.supabase.co";
  window.Kinetic.SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56ZXRvZWV3dm56bm95dWhkaWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NzUwNTYsImV4cCI6MjA5MjM1MTA1Nn0.oO2s1vA_NppY-8-GUs-HOWsQ5n2wrkgCBDoJyY924c8";

  // generate(type, text, systemPrompt) -> ruwe model-output (JSON-string).
  // type is "tijdlijn" of "rapport". Gooit Error met leesbare melding.
  window.Kinetic.generate = async function (type, text, systemPrompt) {
    var resp = await fetch(
      window.Kinetic.SUPABASE_URL + "/functions/v1/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": window.Kinetic.SUPABASE_ANON_KEY,
          "Authorization": "Bearer " + window.Kinetic.SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ type: type, text: text, systemPrompt: systemPrompt })
      }
    );
    var data = await resp.json().catch(function () { return {}; });
    if (!resp.ok) {
      throw new Error(data.error || ("Edge Function fout " + resp.status));
    }
    return data.content;
  };
})();
