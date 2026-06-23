/* ==========================================================================
   Dossier-werkruimte — drie stappen (pseudonimiseren, tijdlijn, rapport).
   Hergebruikt de demo-logica via het Kinetic-namespace:
     Kinetic.pseudonymize(text)         -> {text, stats, html}
     Kinetic.generateTimeline(text)     -> tijdlijn-data (async)
     Kinetic.renderTimeline(data, el)
     Kinetic.generateRapport(text)      -> rapport-data (async)
     Kinetic.renderRapport(data, el)
   Vereist: supabase-js (global `supabase`) en assets/demo/layout.js.
   ========================================================================== */
(function () {
"use strict";

var esc = window.Kinetic.esc;
var sb = supabase.createClient(window.Kinetic.SUPABASE_URL, window.Kinetic.SUPABASE_ANON_KEY);

var STATUS_LABEL = { nieuw:"Nieuw", voorbereiding:"Voorbereiding", bij_arts:"Bij arts", definitief:"Definitief" };

var state = {
  id: new URLSearchParams(location.search).get("id"),
  dossier: null,
  documents: [],
  results: { tijdlijn:null, rapport:null }, // laatste versie per type
  lastPseudo: null,
  profiles: [],     // andere gebruikers (voor toewijzing)
  myId: null,       // huidige gebruiker
  artsFill: false   // arts-invulweergave aan/uit (handmatig te togglen, voor iedereen)
};

async function ensureProfile(session){
  try{
    var u = session.user;
    await sb.from("profiles").upsert(
      { id: u.id, naam: u.email },
      { onConflict: "id", ignoreDuplicates: true }
    );
  }catch(e){ /* niet kritiek */ }
}

async function loadProfiles(){
  var res = await sb.from("profiles").select("id,naam");
  state.profiles = (res.data || []).filter(function(p){ return p.id !== state.myId; });
}

function $(id){ return document.getElementById(id); }
function fmtDate(d){ if(!d) return "—"; var p=String(d).slice(0,10).split("-"); return p.length===3?p[2]+"-"+p[1]+"-"+p[0]:d; }
function fmtDateTime(s){ var d=new Date(s); if(isNaN(d)) return ""; return ("0"+d.getDate()).slice(-2)+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+d.getFullYear(); }

/* ── Infobar ─────────────────────────────────────────────────────────────── */
function renderInfobar(){
  var d = state.dossier;
  $("infobar").innerHTML =
    ib("Zaaknummer", esc(d.zaaknummer||"—")) +
    ib("Betrokkene", '<span class="redacted">'+esc(d.betrokkene||"—")+'</span>') +
    ib("Specialisme", esc(d.specialisme||"—")) +
    ib("Opdrachtgever", esc(d.opdrachtgever||"—")) +
    ib("Status", '<span class="badge badge-'+esc(d.status)+'">'+esc(STATUS_LABEL[d.status]||d.status)+'</span>') +
    ib("Toegewezen aan", esc(d.toegewezen_aan||"—"));
  function ib(label,val){ return '<div class="ib"><span class="label">'+label+'</span><span class="val">'+val+'</span></div>'; }
}

/* ── Tabs ────────────────────────────────────────────────────────────────── */
function switchTab(name){
  ["pseudo","tijdlijn","rapport"].forEach(function(t){
    $("tab-"+t).classList.toggle("active", t===name);
    $("panel-"+t).classList.toggle("active", t===name);
  });
  if(name==="tijdlijn") showResult("tijdlijn");
  if(name==="rapport") showResult("rapport");
}
function refreshTabState(){
  $("tab-pseudo").classList.toggle("done", state.documents.length>0);
  $("tab-tijdlijn").classList.toggle("done", !!state.results.tijdlijn);
  $("tab-rapport").classList.toggle("done", !!state.results.rapport);
}

/* ── Stap 1: pseudonimiseren ─────────────────────────────────────────────── */
function runPseudo(){
  var text = $("rawInput").value.trim();
  if(!text) return;
  var res = window.Kinetic.pseudonymize(text);
  state.lastPseudo = { text: res.text, stats: res.stats, charCount: res.text.length };
  $("pseudoOut").innerHTML = res.html;
  $("pseudoOut").style.display = "block";
  var s = res.stats;
  $("statline").innerHTML =
    "<span><b>"+s.total+"</b> vervangingen</span>"+
    "<span><b>"+s.names+"</b> namen</span>"+
    "<span><b>"+s.bsn+"</b> BSN&rsquo;s</span>"+
    "<span><b>"+s.dates+"</b> datums</span>"+
    "<span><b>"+s.contact+"</b> contact</span>"+
    "<span><b>"+s.orgs+"</b> overig</span>";
  $("statline").style.display = "flex";
  $("saveDocBtn").disabled = false;
}

async function saveDocument(){
  if(!state.lastPseudo) return;
  var label = $("docLabel").value.trim() || "Document " + (state.documents.length+1);
  var btn = $("saveDocBtn"); btn.disabled = true; btn.textContent = "Opslaan…";
  var res = await sb.from("dossier_documents").insert({
    dossier_id: state.id,
    label: label,
    content: state.lastPseudo.text,
    stats: state.lastPseudo.stats,
    char_count: state.lastPseudo.charCount
  }).select().single();
  btn.textContent = "Opslaan als document";
  if(res.error){ alert("Opslaan mislukt: "+res.error.message); return; }
  // Reset invoer voor het volgende document
  $("rawInput").value = ""; $("docLabel").value = "";
  $("pseudoOut").style.display = "none"; $("statline").style.display = "none";
  state.lastPseudo = null;
  await loadDocuments();
}

async function loadDocuments(){
  var res = await sb.from("dossier_documents").select("*").eq("dossier_id", state.id).order("created_at",{ascending:true});
  state.documents = (res.data||[]);
  renderDocList();
  refreshTabState();
  // generatieknoppen alleen actief met documenten
  $("genTijdlijnBtn").disabled = state.documents.length===0;
  $("genRapportBtn").disabled = state.documents.length===0;
}

function renderDocList(){
  var host = $("docList");
  if(state.documents.length===0){ host.innerHTML = '<div class="doc-empty">Nog geen documenten opgeslagen.</div>'; return; }
  host.innerHTML = state.documents.map(function(d){
    return '<div class="doc-item"><span class="doc-label">'+esc(d.label)+'</span>'+
      '<span class="doc-meta">'+esc(fmtDateTime(d.created_at))+' &middot; '+(d.char_count||0)+' tekens</span>'+
      '<button class="doc-del" data-id="'+esc(d.id)+'" title="Verwijderen">&times;</button></div>';
  }).join("");
  host.querySelectorAll(".doc-del").forEach(function(b){
    b.addEventListener("click", async function(){
      if(!confirm("Document verwijderen?")) return;
      await sb.from("dossier_documents").delete().eq("id", b.getAttribute("data-id"));
      await loadDocuments();
    });
  });
}

function combinedText(){
  return state.documents.map(function(d){
    return "=== "+d.label+" ===\n"+d.content;
  }).join("\n\n");
}

/* ── Stap 2/3: generatie ─────────────────────────────────────────────────── */
function loadingHost(host, msg){
  host.innerHTML = '<div class="gen-loading"><span class="spinner-t"></span>'+esc(msg)+'</div>';
}

async function generate(type){
  if(state.documents.length===0) return;
  var host = $(type+"Host");
  var btn = $("gen"+(type==="tijdlijn"?"Tijdlijn":"Rapport")+"Btn");
  btn.disabled = true;
  loadingHost(host, "AI genereert "+(type==="tijdlijn"?"tijdlijn":"concept-rapport")+"…");
  try{
    var data = (type==="tijdlijn")
      ? await window.Kinetic.generateTimeline(combinedText())
      : await window.Kinetic.generateRapport(combinedText());
    renderInto(type, data, host);
    await saveResult(type, data);
  }catch(err){
    host.innerHTML = '<div class="notice warn"><strong>Fout bij verwerking:</strong> '+esc(err.message)+
      '<br>'+( /Failed to fetch|NetworkError|CORS/.test(err.message)
        ? "De AI-service is momenteel niet bereikbaar. Probeer het opnieuw."
        : "Controleer of de documenten geldige (gepseudonimiseerde) dossiertekst bevatten." )+'</div>';
  }
  btn.disabled = false;
}

function renderInto(type, data, host){
  host.innerHTML = "";
  if(type==="tijdlijn") window.Kinetic.renderTimeline(data, host);
  else window.Kinetic.renderRapport(data, host);
}

async function saveResult(type, data){
  var prev = state.results[type];
  var version = prev ? (prev.version+1) : 1;
  var res = await sb.from("dossier_results").insert({
    dossier_id: state.id, type: type, payload: data, version: version
  }).select().single();
  if(!res.error){ state.results[type] = res.data; refreshTabState(); }
  // Eerste generatie zet status naar 'voorbereiding'
  if(state.dossier.status==="nieuw") await updateStatus("voorbereiding");
}

function showResult(type){
  var host = $(type+"Host");
  if(host.children.length>0 && !host.querySelector(".gen-empty")) return; // al gerenderd
  var r = state.results[type];
  if(r){
    if(type==="rapport" && state.artsFill) renderArtsView(r.payload, host);
    else renderInto(type, r.payload, host);
  }
  else{
    host.innerHTML = '<div class="gen-empty notice">'+(state.artsFill
      ? 'Nog geen concept-rapport beschikbaar voor dit dossier.'
      : 'Nog geen '+(type==="tijdlijn"?"tijdlijn":"rapport")+' gegenereerd. Gebruik de knop hierboven om te genereren uit de opgeslagen documenten.')+'</div>';
  }
}

async function loadResults(){
  var res = await sb.from("dossier_results").select("*").eq("dossier_id", state.id).order("version",{ascending:false});
  (res.data||[]).forEach(function(r){
    if(!state.results[r.type]) state.results[r.type] = r; // hoogste versie eerst
  });
  refreshTabState();
}

/* ── Arts-weergave (scherm 4) ────────────────────────────────────────────── */
// Verzamel de in te vullen arts-velden uit het rapport (arts_template + iwmd_answers).
function artsFields(data){
  var out = [];
  (data && data.sections || []).forEach(function(s){
    if(s.badge !== "arts") return;
    if(s.type === "arts_template" && s.subfields){
      s.subfields.forEach(function(sf,i){
        out.push({ key:s.num+"::"+i, section:s.title,
          label:(typeof sf==="string"?sf:sf.label),
          context:(typeof sf==="string"?null:sf.context) });
      });
    } else if(s.type === "iwmd_answers" && s.questions){
      s.questions.forEach(function(q,i){
        out.push({ key:s.num+"::"+i, section:s.title,
          label:(typeof q==="string"?q:q.q),
          context:(typeof q==="string"?null:q.context) });
      });
    }
  });
  return out;
}

function renderArtsView(data, host){
  var inputs = state.dossier.arts_inputs || {};
  var h = '<div class="arts-banner">Arts-weergave — vul je secties in. Het AI-concept staat ingeklapt als referentie.</div>';
  h += '<details class="ai-ref"><summary>AI-concept tonen als referentie</summary><div id="aiRefHost"></div></details>';
  var fields = artsFields(data);
  var curSection = null;
  h += '<div class="arts-form">';
  fields.forEach(function(f){
    if(f.section !== curSection){ curSection = f.section; h += '<h3 class="arts-sec-title">'+esc(f.section)+'</h3>'; }
    h += '<div class="arts-field">';
    h += '<label class="arts-label">'+esc(f.label)+'</label>';
    if(f.context) h += '<div class="rp-arts-context"><span class="rp-arts-ctx-label">Dossier:</span> '+esc(f.context)+'</div>';
    h += '<textarea class="arts-input" data-key="'+esc(f.key)+'" placeholder="Bevindingen / oordeel arts…">'+esc(inputs[f.key]||"")+'</textarea>';
    h += '</div>';
  });
  if(fields.length === 0) h += '<div class="notice">Dit rapport bevat geen arts-secties om in te vullen.</div>';
  h += '</div>';
  host.innerHTML = h;
  // AI-concept volledig renderen in de inklapbare referentie
  window.Kinetic.renderRapport(data, document.getElementById("aiRefHost"));
}

function artsRequiredKeys(){
  var r = state.results.rapport;
  return r ? artsFields(r.payload).map(function(f){ return f.key; }) : [];
}
function artsComplete(){
  var keys = artsRequiredKeys();
  if(keys.length === 0) return false;
  var inp = state.dossier.arts_inputs || {};
  return keys.every(function(k){ return inp[k] && String(inp[k]).trim().length > 0; });
}
function updateFinalAvailability(){
  var btn = $("finalBtn"); if(!btn) return;
  var ok = !!state.results.rapport && artsComplete();
  btn.disabled = !ok;
  btn.title = ok ? "" : "Beschikbaar zodra alle arts-secties zijn ingevuld";
}

function showSaved(){
  var s = $("savedInd"); if(!s) return;
  s.style.display = "inline-flex";
  setTimeout(function(){ s.style.display = "none"; }, 2500);
}

async function saveArtsInputs(){
  var map = {};
  document.querySelectorAll(".arts-input").forEach(function(t){ map[t.getAttribute("data-key")] = t.value; });
  var btn = $("saveArtsBtn"); btn.disabled = true; btn.textContent = "Opslaan…";
  var res = await sb.from("dossiers").update({ arts_inputs: map }).eq("id", state.id).select().single();
  btn.disabled = false; btn.textContent = "Secties opslaan";
  if(res.error){ alert("Opslaan mislukt: "+res.error.message); return; }
  state.dossier = res.data;
  showSaved();
  updateFinalAvailability();
}

async function sendBack(){
  var notitie = prompt("Notitie bij terugsturen (optioneel):", "");
  if(notitie === null) return; // geannuleerd
  if(await updateStatus("voorbereiding", { terugstuur_notitie: notitie })){
    alert("Rapport teruggestuurd naar voorbereiding.");
    window.location.href = "dashboard.html";
  }
}

function applyArtsButtons(){
  var fill = state.artsFill;
  $("saveArtsBtn").style.display = fill ? "" : "none";
  $("sendBackBtn").style.display = fill ? "" : "none";
  var t = $("artsToggleBtn");
  if(t) t.textContent = fill ? "Toon concept" : "Arts-invulling";
}

function toggleArtsFill(){
  state.artsFill = !state.artsFill;
  applyArtsButtons();
  var host = $("rapportHost");
  host.innerHTML = "";          // forceer opnieuw renderen in de juiste modus
  showResult("rapport");
}

/* ── Actiebalk ───────────────────────────────────────────────────────────── */
async function updateStatus(status, extra){
  var patch = Object.assign({ status: status }, extra||{});
  var res = await sb.from("dossiers").update(patch).eq("id", state.id).select().single();
  if(res.error){ alert("Status bijwerken mislukt: "+res.error.message); return false; }
  state.dossier = res.data; renderInfobar(); return true;
}

function activePanel(){
  return $("panel-tijdlijn").classList.contains("active") ? "tijdlijn"
       : $("panel-rapport").classList.contains("active") ? "rapport" : "pseudo";
}

/* ── Toewijzen aan arts ──────────────────────────────────────────────────── */
function openAssignModal(){
  var sel = $("assignSelect"); sel.innerHTML = "";
  if(state.profiles.length === 0){
    $("assignError").textContent = "Geen andere gebruikers gevonden. Laat de arts eerst één keer inloggen op /tooling/.";
    $("assignConfirm").disabled = true;
  }else{
    $("assignError").textContent = "";
    $("assignConfirm").disabled = false;
    state.profiles.forEach(function(p){
      var o = document.createElement("option");
      o.value = p.id; o.textContent = p.naam || p.id; o.setAttribute("data-naam", p.naam || p.id);
      sel.appendChild(o);
    });
  }
  $("assignModal").classList.add("open");
}
function closeAssignModal(){ $("assignModal").classList.remove("open"); }
async function confirmAssign(){
  var sel = $("assignSelect");
  if(!sel.value){ $("assignError").textContent = "Kies een arts."; return; }
  var opt = sel.options[sel.selectedIndex];
  var btn = $("assignConfirm"); btn.disabled = true; btn.textContent = "Toewijzen…";
  var ok = await updateStatus("bij_arts", { toegewezen_aan_id: sel.value, toegewezen_aan: opt.getAttribute("data-naam") });
  btn.disabled = false; btn.textContent = "Toewijzen";
  if(ok){ closeAssignModal(); refreshTabState(); }
}

function bindActions(){
  $("regenBtn").addEventListener("click", function(){
    var p = activePanel();
    if(p==="tijdlijn" || p==="rapport") generate(p);
    else alert("Selecteer de tijdlijn- of rapport-stap om opnieuw te genereren.");
  });
  $("wordBtn").addEventListener("click", function(){
    alert("Word-export (.docx met read-only AI-secties en bewerkbare arts-velden) volgt in een latere stap.");
  });
  $("assignBtn").addEventListener("click", openAssignModal);
  $("assignClose").addEventListener("click", closeAssignModal);
  $("assignCancel").addEventListener("click", closeAssignModal);
  $("assignConfirm").addEventListener("click", confirmAssign);
  $("assignModal").addEventListener("click", function(e){ if(e.target.id==="assignModal") closeAssignModal(); });
  $("saveArtsBtn").addEventListener("click", saveArtsInputs);
  $("sendBackBtn").addEventListener("click", sendBack);
  $("finalBtn").addEventListener("click", async function(){
    if(!state.results.rapport){ alert("Genereer eerst een concept-rapport voordat je het dossier definitief maakt."); return; }
    if(confirm("Dossier markeren als definitief?")) await updateStatus("definitief");
  });
}

/* ── Init ────────────────────────────────────────────────────────────────── */
async function init(){
  var sess = await sb.auth.getSession();
  if(!(sess.data && sess.data.session)){ window.location.replace("./index.html"); return; }
  $("userEmail").textContent = sess.data.session.user.email || "";
  $("logout").addEventListener("click", function(){ sb.auth.signOut().then(function(){ window.location.replace("./index.html"); }); });
  state.myId = sess.data.session.user.id;
  await ensureProfile(sess.data.session);

  if(!state.id){ document.querySelector(".page").innerHTML = '<div class="notice warn">Geen dossier opgegeven.</div>'; return; }

  var res = await sb.from("dossiers").select("*").eq("id", state.id).single();
  if(res.error || !res.data){
    document.querySelector(".page").innerHTML = '<div class="notice warn">Dossier niet gevonden of geen toegang.</div>';
    return;
  }
  state.dossier = res.data;
  renderInfobar();

  // Tabs
  ["pseudo","tijdlijn","rapport"].forEach(function(t){
    $("tab-"+t).addEventListener("click", function(){ switchTab(t); });
  });
  // Stap 1
  $("pseudoBtn").addEventListener("click", runPseudo);
  $("saveDocBtn").addEventListener("click", saveDocument);
  // Stap 2/3
  $("genTijdlijnBtn").addEventListener("click", function(){ generate("tijdlijn"); });
  $("genRapportBtn").addEventListener("click", function(){ generate("rapport"); });
  $("artsToggleBtn").addEventListener("click", toggleArtsFill);
  bindActions();

  await loadProfiles();
  await loadDocuments();
  await loadResults();
  applyArtsButtons();
  updateFinalAvailability();
  switchTab("pseudo");
}

if(document.readyState==="loading"){ document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
