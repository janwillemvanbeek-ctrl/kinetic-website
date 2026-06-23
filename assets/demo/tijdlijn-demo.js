/* ==========================================================================
   Tijdlijn-demo — chronologische extractie
   Voorbeeldmodus: hardcoded whiplash-casus. AI-modus: Mistral via de
   Supabase Edge Function "generate" (Kinetic.generate).
   Vereist assets/demo/layout.js (Kinetic.esc).
   ========================================================================== */
(function () {
"use strict";
var esc = window.Kinetic.esc;

var EXAMPLE_DATA={
zaak:{zaaknummer:"2024-KME-04892",betrokkene:"[PERSOON-1]",geboortedatum:"[GEBOORTEDATUM]",ongevalsdatum:"29-01-2022"},
events:[
{date:"29-01-2022",day:0,tag:"seh",tagLabel:"SEH",title:"SEH-presentatie na verkeersongeval",body:"Kop-staartbotsing op de A27 ter hoogte van afslag Lexmond. Betrokkene werd van achteren aangereden terwijl hij stilstond. Direct nekpijn en hoofdpijn. Whiplash Associated Disorder graad II vastgesteld door SEH-arts.",source:"Antonius Ziekenhuis Nieuwegein, SEH-verslag, p. 1–2"},
{date:"14-02-2022",day:16,tag:"huisarts",tagLabel:"HUISARTS",title:"Controle huisarts",body:"Toenemende cervicobrachialgie links. Concentratiestoornissen. Hoofdpijn dagelijks, VAS-score 6–7. Tintelingen digiti III–V links. Verwijzing fysiotherapie.",source:"Huisartsenpraktijk, brief, p. 1"},
{date:"21-02-2022",day:23,tag:"fysio",tagLabel:"FYSIO",title:"Fysiotherapie — intake",body:"Start revalidatietraject bij FysioFit Utrecht. Cervicale mobiliteit beperkt: flexie 35°, extensie 25°. Behandelplan: 2x per week, 16 weken. Behandelaar: [PERSOON-5].",source:"FysioFit Utrecht, intake, p. 3"},
{gap:true,afterDate:"13-06-2022",afterDay:135,text:"Geen eindverslag fysiotherapie aangetroffen. Verwacht: afsluitend verslag na 16 weken behandeling (gepland rond juni 2022). Effectiviteit behandeling niet gedocumenteerd."},
{date:"18-08-2022",day:201,tag:"radio",tagLabel:"MRI",title:"MRI cervicale wervelkolom (HWK)",body:"Discusdegeneratie C5–C6, lichte foraminastenose rechts. Geen HNP. Geen myelopathie. Lichte spondylartrose.",source:"Radiologie Antonius Ziekenhuis, verslag, p. 1"},
{date:"12-10-2022",day:256,tag:"pijn",tagLabel:"PIJN",title:"Verwijzing pijnrevalidatie",body:"Persisterende cervicobrachialgie ondanks fysiotherapie. Verwijzing naar multidisciplinair pijnprogramma Sint Maartenskliniek.",source:"Sint Maartenskliniek Nijmegen, verwijsbrief, p. 1–2"},
{gap:true,afterDate:"12-10-2022",afterDay:256,text:"Geen intake- of voortgangsverslag pijnrevalidatie aangetroffen. Verwacht: intakeverslag Sint Maartenskliniek na verwijzing oktober 2022. Status behandeltraject onduidelijk."},
{date:"15-01-2023",day:351,tag:"neuro",tagLabel:"NEURO",title:"Facetdenervatie C4–C5 en C5–C6",body:"Radiofrequente denervatie onder fluoroscopie door [PERSOON-6], anesthesioloog. Procedure zonder complicaties. Verwachte pijnreductie na 2–4 weken.",source:"Anesthesiologie, operatieverslag, p. 1"},
{date:"08-03-2023",day:403,tag:"psych",tagLabel:"CGT",title:"Start Cognitieve Gedragstherapie",body:"Behandeling concentratiestoornissen en pijncoping. Diagnose: Post Commotioneel Syndroom. Behandelplan: 12 sessies bij [PERSOON-7].",source:"Psychologenpraktijk, intake, p. 1–2"},
{date:"23-04-2024",day:815,tag:"neuro",tagLabel:"NEURO",title:"Neurologisch expertiseonderzoek",body:"Cervicale mobiliteit: flexie 30° (normaal 50°), extensie 20° (normaal 60°), rotatie links 40° (normaal 80°). Spurling positief links. Hypoesthesie C7 links. Tricepsreflex verlaagd. Conclusie: 7% blijvende invaliditeit (AMA Guides, 6e editie).",source:"Kliniek voor Neurologische Expertise, rapport, p. 4–6"}
],
stats:{events:8,gaps:2,sources:8,spanDays:815}
};

function fmtDay(d){
if(d===0)return"Dag 0";
if(d<=90)return"Dag "+d;
if(d<=730){var w=Math.round(d/7);return"Week "+w+" (dag "+d+")";}
var m=Math.round(d/30.44);
if(m<=24)return"Maand "+m+" (dag "+d+")";
var y=(d/365.25).toFixed(1);return y+" jaar (dag "+d+")";
}

function renderTimeline(data){
var o=document.getElementById("output");
var h='<div class="dossier-header">';
h+='<div class="dossier-meta"><span class="dossier-label">Zaaknummer</span><span class="dossier-value">'+esc(data.zaak.zaaknummer)+'</span></div>';
h+='<div class="dossier-meta"><span class="dossier-label">Betrokkene</span><span class="dossier-value dossier-redacted">'+esc(data.zaak.betrokkene)+'</span></div>';
h+='<div class="dossier-meta"><span class="dossier-label">Geboortedatum</span><span class="dossier-value dossier-redacted">'+esc(data.zaak.geboortedatum)+'</span></div>';
h+='<div class="dossier-meta"><span class="dossier-label">Ongevalsdatum</span><span class="dossier-value">'+esc(data.zaak.ongevalsdatum)+'</span></div>';
h+='</div>';
h+='<h3 class="section-heading">Chronologisch overzicht</h3>';
h+='<div class="timeline">';
data.events.forEach(function(ev,i){
var dl=(i*0.06)+"s";
if(ev.gap){
h+='<div class="tl-gap tl-item" style="animation-delay:'+dl+'">';
h+='<div class="tl-gap-card">';
h+='<svg class="tl-gap-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="8"/><line x1="10" y1="6" x2="10" y2="11"/><circle cx="10" cy="14" r=".5" fill="currentColor"/></svg>';
h+='<div class="tl-gap-text"><strong>Hiaat gedetecteerd</strong><br>'+esc(ev.text)+'</div>';
h+='</div></div>';
}else{
h+='<div class="tl-item" style="animation-delay:'+dl+'">';
h+='<span class="tl-tag '+ev.tag+'">'+esc(ev.tagLabel)+'</span>';
h+='<div class="tl-card">';
h+='<div class="tl-date">'+esc(ev.date)+' &middot; <strong>'+fmtDay(ev.day)+'</strong></div>';
h+='<div class="tl-event-title">'+esc(ev.title)+'</div>';
h+='<div class="tl-body">'+esc(ev.body)+'</div>';
h+='<div class="tl-source"><strong>Bron:</strong> '+esc(ev.source)+'</div>';
h+='</div></div>';
}
});
h+='</div>';
h+='<div class="tl-summary">';
h+='<div class="tl-stat"><div class="tl-stat-val">'+data.stats.events+'</div><div class="tl-stat-lbl">Gebeurtenissen</div></div>';
h+='<div class="tl-stat"><div class="tl-stat-val" style="color:var(--c-seh)">'+data.stats.gaps+'</div><div class="tl-stat-lbl">Hiaten</div></div>';
h+='<div class="tl-stat"><div class="tl-stat-val">'+data.stats.sources+'</div><div class="tl-stat-lbl">Bronverwijzingen</div></div>';
h+='<div class="tl-stat"><div class="tl-stat-val">'+fmtDay(data.stats.spanDays)+'</div><div class="tl-stat-lbl">Totale periode</div></div>';
h+='</div>';
o.innerHTML=h;
}

var currentMode="example";
function setMode(mode){
currentMode=mode;
document.getElementById("modeExample").classList.toggle("active",mode==="example");
document.getElementById("modeCustom").classList.toggle("active",mode==="custom");
document.getElementById("inputPanel").classList.toggle("hidden",mode==="example");
if(mode==="example"){renderTimeline(EXAMPLE_DATA);}
else{document.getElementById("output").innerHTML='<div style="text-align:center;padding:3rem;color:var(--stone)"><p>Plak een gepseudonimiseerd medisch dossier hierboven en klik op <strong>Extraheer tijdlijn</strong>.</p></div>';}
}

async function extractTimeline(){
var text=document.getElementById("customInput").value.trim();
if(!text)return;
var btn=document.getElementById("extractBtn");
btn.disabled=true;
btn.innerHTML='<span class="spinner"></span>Verwerken…';
document.getElementById("output").innerHTML='<div style="text-align:center;padding:3rem;color:var(--stone)"><div class="spinner" style="border-color:rgba(47,111,106,.2);border-top-color:var(--warm-teal);width:24px;height:24px;margin:0 auto"></div><p style="margin-top:1rem">AI analyseert het dossier…</p></div>';
try{
var content=await window.Kinetic.generate("tijdlijn",text,"Je bent een medisch dossier-analist. Extraheer een chronologische tijdlijn uit het onderstaande dossier.\n\nRegels:\n- Identificeer ALLE medische gebeurtenissen met een datum\n- Bepaal de ongevalsdatum als T±0 en bereken voor elke gebeurtenis het aantal dagen erna\n- Categoriseer per specialisme met deze exacte tag-waarden: seh, ortho, radio, fysio, pijn, neuro, psych, huisarts, overig\n- Geef per gebeurtenis de bron (naam instelling, type document, paginanummer)\n- Detecteer hiaten: ontbrekende vervolgafspraken, missende verslagen, onverklaarde gaten\n- Extraheer zaakgegevens\n\nKRITIEK: Antwoord met ALLEEN valide JSON. Geen markdown backticks. Geen toelichting voor of na de JSON. Gebruik ALLEEN dubbele aanhalingstekens in de JSON. Geen single quotes. Geen trailing commas. Geen comments.\n\nJSON structuur:\n{\"zaak\":{\"zaaknummer\":\"...\",\"betrokkene\":\"...\",\"geboortedatum\":\"...\",\"ongevalsdatum\":\"DD-MM-YYYY\"},\"events\":[{\"date\":\"DD-MM-YYYY\",\"day\":0,\"tag\":\"seh\",\"tagLabel\":\"SEH\",\"title\":\"korte titel\",\"body\":\"beschrijving max 2 zinnen\",\"source\":\"instelling, document, p. X\"},{\"gap\":true,\"afterDate\":\"DD-MM-YYYY\",\"afterDay\":0,\"text\":\"beschrijving van het hiaat\"}],\"stats\":{\"events\":0,\"gaps\":0,\"sources\":0,\"spanDays\":0}}\n\nDossier:\n\n");
content=content.replace(/```json|```/g,"").trim();
var si=content.indexOf("{");var ei=content.lastIndexOf("}");
if(si>=0&&ei>si)content=content.substring(si,ei+1);
content=content.replace(/,\s*([}\]])/g,"$1");
var parsed=JSON.parse(content);
renderTimeline(parsed);
}catch(err){
document.getElementById("output").innerHTML='<div style="text-align:center;padding:3rem;color:var(--c-seh)"><p><strong>Fout bij verwerking:</strong> '+esc(err.message)+'</p><p style="margin-top:.5rem;color:var(--stone)">'+(err.message.indexOf("Failed to fetch")>=0||err.message.indexOf("NetworkError")>=0||err.message.indexOf("CORS")>=0?'De AI-service is momenteel niet bereikbaar. Controleer je verbinding en probeer het opnieuw.':'Controleer of de tekst een geldig (gepseudonimiseerd) medisch dossier bevat.')+'</p></div>';
}
btn.disabled=false;
btn.innerHTML="Extraheer tijdlijn";
}

function init(){
document.getElementById("modeExample").addEventListener("click",function(){setMode("example");});
document.getElementById("modeCustom").addEventListener("click",function(){setMode("custom");});
document.getElementById("extractBtn").addEventListener("click",extractTimeline);
renderTimeline(EXAMPLE_DATA);
}

if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();
