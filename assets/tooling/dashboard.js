/* ==========================================================================
   Dashboard — overzicht van dossiers (auth-gated).
   Vereist: supabase-js (global `supabase`) en assets/demo/layout.js
   (Kinetic.SUPABASE_URL / SUPABASE_ANON / esc).
   ========================================================================== */
(function () {
"use strict";

var esc = window.Kinetic.esc;
var sb = supabase.createClient(window.Kinetic.SUPABASE_URL, window.Kinetic.SUPABASE_ANON);

var STATUS_LABEL = { nieuw:"Nieuw", voorbereiding:"Voorbereiding", bij_arts:"Bij arts", definitief:"Definitief" };
var SPECIALISMEN = ["Orthopedisch","Neurologisch","Psychiatrisch","Multidisciplinair"];

var state = { dossiers:[], filter:"alle", query:"" };

function fmtDate(d){
  if(!d) return "—";
  var p = String(d).slice(0,10).split("-"); // YYYY-MM-DD
  return p.length===3 ? p[2]+"-"+p[1]+"-"+p[0] : d;
}

function statusBadge(s){
  var lbl = STATUS_LABEL[s] || s || "—";
  return '<span class="badge badge-'+esc(s)+'">'+esc(lbl)+'</span>';
}

function visible(){
  return state.dossiers.filter(function(d){
    if(state.filter!=="alle" && d.status!==state.filter) return false;
    if(state.query){
      var q = state.query.toLowerCase();
      var hay = ((d.zaaknummer||"")+" "+(d.betrokkene||"")).toLowerCase();
      if(hay.indexOf(q)<0) return false;
    }
    return true;
  });
}

function render(){
  var rows = visible();
  var host = document.getElementById("list");

  if(state.dossiers.length===0){
    host.innerHTML = '<div class="empty"><p>Nog geen dossiers. Maak je eerste dossier aan.</p>'
      + '<button class="btn btn-primary" id="emptyNew">+ Nieuw dossier</button></div>';
    document.getElementById("emptyNew").addEventListener("click", openModal);
    return;
  }
  if(rows.length===0){
    host.innerHTML = '<div class="empty"><p>Geen dossiers gevonden voor deze filter of zoekopdracht.</p></div>';
    return;
  }

  var h = '<div class="table-wrap"><table class="dossiers"><thead><tr>'
    + '<th>Zaaknummer</th><th>Betrokkene</th><th>Specialisme</th><th>Opdrachtgever</th>'
    + '<th>Status</th><th>Ongevalsdatum</th><th>Toegewezen aan</th>'
    + '</tr></thead><tbody>';
  rows.forEach(function(d){
    h += '<tr data-id="'+esc(d.id)+'">'
      + '<td><span class="zaaknr">'+esc(d.zaaknummer||"—")+'</span></td>'
      + '<td><span class="redacted">'+esc(d.betrokkene||"—")+'</span></td>'
      + '<td>'+esc(d.specialisme||"—")+'</td>'
      + '<td>'+esc(d.opdrachtgever||"—")+'</td>'
      + '<td>'+statusBadge(d.status)+'</td>'
      + '<td>'+esc(fmtDate(d.ongevalsdatum))+'</td>'
      + '<td>'+esc(d.toegewezen_aan||"—")+'</td>'
      + '</tr>';
  });
  h += '</tbody></table></div>';
  host.innerHTML = h;

  host.querySelectorAll("tr[data-id]").forEach(function(tr){
    tr.addEventListener("click", function(){
      window.location.href = "dossier.html?id=" + encodeURIComponent(tr.getAttribute("data-id"));
    });
  });
}

async function loadDossiers(){
  document.getElementById("list").innerHTML =
    '<div class="loading-row"><span class="spinner-t"></span>Dossiers laden…</div>';
  var res = await sb.from("dossiers").select("*").order("created_at",{ascending:false});
  if(res.error){
    document.getElementById("list").innerHTML =
      '<div class="empty"><p style="color:var(--red)">Fout bij laden: '+esc(res.error.message)+'</p></div>';
    return;
  }
  state.dossiers = res.data || [];
  render();
}

/* ── Nieuw dossier modal ─────────────────────────────────────────────────── */
function openModal(){
  document.getElementById("modal").classList.add("open");
  document.getElementById("f-zaak").focus();
}
function closeModal(){
  document.getElementById("modal").classList.remove("open");
  document.getElementById("form-error").textContent = "";
}

async function submitDossier(){
  var zaak = document.getElementById("f-zaak").value.trim();
  var errEl = document.getElementById("form-error");
  var zaakEl = document.getElementById("f-zaak");
  if(!zaak){
    zaakEl.classList.add("invalid");
    errEl.textContent = "Zaaknummer is verplicht.";
    return;
  }
  zaakEl.classList.remove("invalid");

  var btn = document.getElementById("createBtn");
  btn.disabled = true; btn.textContent = "Aanmaken…";

  var sess = await sb.auth.getSession();
  var uid = sess.data && sess.data.session && sess.data.session.user && sess.data.session.user.id;

  var payload = {
    zaaknummer: zaak,
    opdrachtgever: document.getElementById("f-opdr").value.trim() || null,
    specialisme: document.getElementById("f-spec").value || null,
    ongevalsdatum: document.getElementById("f-datum").value || null,
    notities: document.getElementById("f-notities").value.trim() || null,
    status: "nieuw",
    owner: uid
  };

  var res = await sb.from("dossiers").insert(payload).select().single();
  if(res.error){
    btn.disabled = false; btn.textContent = "Dossier aanmaken";
    errEl.textContent = "Fout: " + res.error.message;
    return;
  }
  // Open de werkruimte voor het nieuwe dossier.
  window.location.href = "dossier.html?id=" + encodeURIComponent(res.data.id);
}

/* ── Init ────────────────────────────────────────────────────────────────── */
async function init(){
  var sess = await sb.auth.getSession();
  if(!(sess.data && sess.data.session)){
    window.location.replace("./index.html");
    return;
  }
  document.getElementById("userEmail").textContent = sess.data.session.user.email || "";

  // Specialisme-dropdown vullen
  var sel = document.getElementById("f-spec");
  SPECIALISMEN.forEach(function(s){
    var o = document.createElement("option"); o.value = s; o.textContent = s; sel.appendChild(o);
  });

  // Logout
  document.getElementById("logout").addEventListener("click", function(){
    sb.auth.signOut().then(function(){ window.location.replace("./index.html"); });
  });

  // Nieuw dossier
  document.getElementById("newBtn").addEventListener("click", openModal);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("cancelBtn").addEventListener("click", closeModal);
  document.getElementById("createBtn").addEventListener("click", submitDossier);
  document.getElementById("modal").addEventListener("click", function(e){
    if(e.target.id==="modal") closeModal();
  });

  // Filters
  document.querySelectorAll(".pill").forEach(function(p){
    p.addEventListener("click", function(){
      document.querySelectorAll(".pill").forEach(function(x){ x.classList.remove("active"); });
      p.classList.add("active");
      state.filter = p.getAttribute("data-status");
      render();
    });
  });

  // Zoek
  document.getElementById("search").addEventListener("input", function(e){
    state.query = e.target.value.trim();
    render();
  });

  await loadDossiers();
}

if(document.readyState==="loading"){ document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
