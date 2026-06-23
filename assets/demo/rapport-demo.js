/* ==========================================================================
   Concept Rapport-demo — IWMD expertiserapport generator
   Voorbeeldmodus: volledig IWMD orthopedisch concept-rapport.
   AI-modus: Mistral via de Supabase Edge Function "generate" (Kinetic.generate).
   IWMD-vraagstelling en AMA Guides-verwijzingen zijn officieel: niet
   wijzigen zonder overleg (zie CLAUDE.md).
   Vereist assets/demo/layout.js (Kinetic.esc).
   ========================================================================== */
(function () {
"use strict";
var esc = window.Kinetic.esc;

var EXAMPLE_RAPPORT = {
  meta: {
    zaaknummer: "2024-KME-04892",
    betrokkene: "[PERSOON-1]",
    geboortedatum: "[GEBOORTEDATUM]",
    status: "Concept",
    specialisme: "Orthopedisch",
    opdrachtgever: "Aon Letselschade B.V.",
    ongevalsdatum: "29-01-2022",
    onderzoeksdatum: "23-04-2024"
  },
  compleetheid: {
    score: 78,
    aanwezig: ["SEH-verslag","Ontslagbrief","Huisartsbrief","Fysiotherapie intake","MRI cervicaal","Verwijsbrief pijnrevalidatie","Operatieverslag denervatie","Intake CGT","Keuringsrapport"],
    ontbrekend: [
      {doc:"Fysiotherapie eindverslag", prio:"kritiek"},
      {doc:"Intake/voortgangsverslag pijnrevalidatie", prio:"kritiek"},
      {doc:"Neuropsychologisch onderzoek (NPA)", prio:"belangrijk"}
    ]
  },
  sections: [
    {
      num:"1", title:"Gegevens opdrachtgever en betrokkene", badge:"ai", type:"fields",
      fields: [
        {label:"Opdrachtgever", value:"Aon Letselschade B.V."},
        {label:"Dossierbehandelaar", value:"[PERSOON-8]", redacted:true},
        {label:"Advocaat betrokkene", value:"[PERSOON-9], [ORGANISATIE-3]", redacted:true},
        {label:"Betrokkene", value:"[PERSOON-1]", redacted:true},
        {label:"Geboortedatum", value:"[GEBOORTEDATUM]", redacted:true},
        {label:"Adres", value:"[ADRES-1]", redacted:true},
        {label:"Ongevalsdatum", value:"29-01-2022"},
        {label:"Aard ongeval", value:"Verkeersongeval (kop-staartbotsing A27)"},
        {label:"Datum onderzoek", value:"23-04-2024"},
        {label:"Plaats onderzoek", value:"[ORGANISATIE-5], [ADRES-2]"}
      ]
    },
    {
      num:"2", title:"Vraagstelling", badge:"ai", type:"iwmd",
      intro:"Onderstaande vraagstelling is conform de IWMD-richtlijnen voor medische expertises bij letselschade en beroepsziekten.",
      questions: [
        "Hoe luidt de anamnese voor wat betreft de aard en de ernst van het letsel, het verloop van de klachten, de toegepaste behandelingen en het resultaat van deze behandelingen? Welke overige klachten en behandelingen op uw vakgebied worden in de post-ongevalsperiode vermeld?",
        "Wilt u op basis van het medisch dossier van betrokkene een beschrijving geven van de medische voorgeschiedenis op uw vakgebied?",
        "Wilt u een beschrijving geven van uw bevindingen bij lichamelijk en eventueel hulponderzoek?",
        "Wat is de diagnose op uw vakgebied? Wilt u daarbij differentiaal diagnostische overwegingen geven?",
        "Indien sprake is van klachten, stoornissen en/of beperkingen op uw vakgebied: bestaat er dan naar uw oordeel een causaal verband met het ongeval? Zo ja, wilt u dit nader onderbouwen? Zo nee, kunt u aangeven waardoor de klachten, stoornissen en/of beperkingen dan wel worden veroorzaakt?",
        "Is de huidige toestand van betrokkene op uw vakgebied als een eindtoestand te beschouwen? Zo ja, per welke datum is dit het geval? Zo nee, welke veranderingen zijn nog te verwachten en op welke termijn?",
        "Welke beperkingen op uw vakgebied bestaan naar uw oordeel bij betrokkene in zijn huidige toestand, ongeacht of deze beperkingen voortvloeien uit het ongeval? Wilt u deze beperkingen zo uitgebreid mogelijk beschrijven en zo nodig een Functionele Mogelijkhedenlijst (FML) invullen?",
        "Indien u beperkingen heeft vastgesteld: zijn deze geheel of gedeeltelijk toe te schrijven aan het ongeval? In hoeverre bestonden deze beperkingen reeds voor het ongeval? Zijn er daarnaast ook beperkingen die geheel of gedeeltelijk aan andere oorzaken dan het ongeval moeten worden toegeschreven?",
        "Heeft u therapeutische suggesties?",
        "Zijn er op uw vakgebied nog andere voor de beoordeling van deze casus van belang zijnde feiten of omstandigheden die u onder de aandacht van de opdrachtgever wilt brengen?"
      ]
    },
    {
      num:"3", title:"Medische voorgeschiedenis", badge:"ai", type:"text",
      paragraphs: [
        "[PERSOON-1] was voor het ongeval van 29 januari 2022 onder behandeling bij de huisarts voor spanningshoofdpijn (2019), waarvoor incidenteel paracetamol werd gebruikt. Er was geen sprake van nekklachten, schouderklachten of overige klachten aan het bewegingsapparaat.",
        "In 2020 vond een routinematige gezondheidskeuring plaats via de werkgever, [ORGANISATIE-4], zonder bijzonderheden. Betrokkene was volledig arbeidsgeschikt."
      ],
      sources: ["Huisartsjournaal [ORGANISATIE-1], 2018\u20132022, p. 1\u20133","Keuringsrapport [ORGANISATIE-4], 14-09-2020, p. 1"]
    },
    {
      num:"4", title:"Toedracht en klachtenbeloop", badge:"ai", type:"text",
      paragraphs: [
        "Op 29 januari 2022 was [PERSOON-1] als bestuurder betrokken bij een kop-staartbotsing op de A27 ter hoogte van afslag Lexmond. Betrokkene stond stil in een file en werd van achteren aangereden door een vrachtwagen. De airbags zijn niet afgegaan. Betrokkene kon zelfstandig het voertuig verlaten maar ervoer direct nekpijn, hoofdpijn en duizeligheid.",
        "Op de SEH van [ORGANISATIE-2] werd een WAD graad II vastgesteld. R\u00f6ntgenonderzoek toonde geen fracturen of luxaties. In de weken erna namen klachten toe: cervicobrachialgie links, dagelijkse hoofdpijn (VAS 6\u20137) en concentratiestoornissen.",
        "Fysiotherapie (16 weken, 2x/week) bij [ORGANISATIE-6] gaf beperkte verbetering. MRI cervicaal (18-08-2022): discusdegeneratie C5\u2013C6 met protrusie en foraminastenose links. Verwijzing pijnrevalidatie (oktober 2022), facetdenervatie C4\u2013C6 (januari 2023) met matige en tijdelijke pijnreductie. In maart 2023 start CGT bij Post Commotioneel Syndroom."
      ],
      sources: ["SEH-verslag [ORGANISATIE-2], 29-01-2022, p. 1\u20132","Huisartsbrief [ORGANISATIE-1], 14-02-2022, p. 1","Fysiotherapie-intake [ORGANISATIE-6], 21-02-2022, p. 3","MRI Radiologie [ORGANISATIE-2], 18-08-2022, p. 1","Verwijsbrief [ORGANISATIE-7], 12-10-2022, p. 1\u20132","Operatieverslag, 15-01-2023, p. 1","Intake CGT [ORGANISATIE-8], 08-03-2023, p. 1\u20132"]
    },
    {
      num:"5", title:"Samenvatting medische informatie", badge:"ai", type:"text",
      paragraphs: [
        "29-01-2022 \u2014 SEH [ORGANISATIE-2]. WAD II. R\u00f6ntgen: geen fracturen.\n14-02-2022 \u2014 Huisarts. Cervicobrachialgie links, verwijzing fysiotherapie.\n21-02-2022 \u2014 Start fysiotherapie. Flexie 35\u00b0, extensie 25\u00b0.\n18-08-2022 \u2014 MRI cervicaal: protrusie C5\u2013C6, foraminastenose links.\n12-10-2022 \u2014 Verwijzing pijnrevalidatie.\n15-01-2023 \u2014 Facetdenervatie C4\u2013C6.\n08-03-2023 \u2014 Start CGT (Post Commotioneel Syndroom).\n23-04-2024 \u2014 Expertiseonderzoek (heden)."
      ],
      sources: ["Zie bronverwijzingen secties 3 en 4"]
    },
    {
      num:"5a", title:"Hiaten in het dossier", badge:"ai", type:"hiaten",
      hiaten: [
        {status:"ontbrekend", prio:"kritiek", doc:"Fysiotherapie eindverslag", verwacht:"Juni 2022", toelichting:"Intake aanwezig (21-02-2022), maar geen afsluitend verslag. Behandelresultaat niet objectief vast te stellen.", actie:"Opvragen bij [ORGANISATIE-6]"},
        {status:"ontbrekend", prio:"kritiek", doc:"Intake/voortgangsverslag pijnrevalidatie", verwacht:"Nov 2022", toelichting:"Verwijzing 12-10-2022, maar geen intake of behandelplan van [ORGANISATIE-7] aangetroffen.", actie:"Opvragen bij [ORGANISATIE-7]"},
        {status:"ontbrekend", prio:"belangrijk", doc:"Neuropsychologisch onderzoek (NPA)", verwacht:"Q1 2024", toelichting:"Neuroloog verwees voor objectivering cognitieve klachten bij PCS. Geen NPA-rapport in dossier.", actie:"Opvragen bij verwijzend neuroloog of betrokkene"}
      ]
    },
    {
      num:"5b", title:"Tegenstrijdigheden en aandachtspunten", badge:"ai", type:"tegenstrijdigheden",
      items: [
        {thema:"Cervicale afwijkingen: pre-existent of traumatisch?", severity:"kritiek",
         bronnen:["CT 29-01-2022: \u201cspondylose C5\u2013C6, pre-existent\u201d (bron 1, p. 2)","MRI 18-08-2022: \u201cprotrusie C5\u2013C6, foraminastenose\u201d (bron 5, p. 1)","Neuroloog 08-03-2023: \u201ccervicobrachialgie, traumatisch geagraveerd\u201d (bron 8, p. 1)"],
         relevantie:"Centraal voor IWMD-vraag 5 (causaliteit). De arts dient te beoordelen of de protrusie nieuw is of progressie van pre-existente degeneratie."},
        {thema:"Ulnaris neuropathie: traumatisch of pre-existent?", severity:"belangrijk",
         bronnen:["EMG 12-01-2023: \u201cmogelijk traumatisch dan wel pre\u00ebxistente sulcus ulnaris\u201d (bron 7, p. 2)","Neuroloog: \u201culnaris neuropathie, post-traumatisch\u201d (bron 8, p. 2)"],
         relevantie:"Neurofysioloog laat causaliteit open; neuroloog concludeert post-traumatisch. Relevant voor IWMD-vraag 8 (pre-existent lijden)."},
        {thema:"Cognitieve klachten: PCS of stemmingsgerelateerd?", severity:"aandacht",
         bronnen:["Neuroloog: \u201cPost Commotioneel Syndroom\u201d (bron 8)","NPA ontbreekt \u2014 klachten niet geobjectiveerd"],
         relevantie:"Zonder NPA niet vast te stellen of klachten primair door commotio of door depressieve symptomatologie."}
      ]
    },
    {
      num:"6", title:"Huidige klachten (anamnese)", badge:"ai", type:"text",
      paragraphs: [
        "Betrokkene rapporteert bij onderzoek d.d. 23-04-2024:",
        "Nek: VAS 5\u20136/10, uitstraling linker schouder/arm. Verergering bij beeldschermwerk en autorijden.\nHoofdpijn: 3\u20134x/week, fronto-temporaal, 4\u20138 uur.\nCognitief: verminderde concentratie, multitasking bemoeilijkt.\nSlaap: moeite met inslapen, 1\u20132x/nacht wakker.\nArbeid: 40% arbeidsongeschikt, werkt 3 dagen/week bij [ORGANISATIE-4]."
      ],
      sources: ["Anamnese 23-04-2024","Brief neurologie 08-03-2023, p. 1\u20132"]
    },
    {
      num:"7", title:"Lichamelijk onderzoek", badge:"arts", type:"arts_template",
      prompt:"Bevindingen door de onderzoekend arts in te vullen.",
      subfields: [
        {label:"Algemene indruk", context:null},
        {label:"Cervicale wervelkolom", context:"Vergelijk: fysio 21-02-2022 (flex 35\u00b0, ext 25\u00b0), neuroloog 08-03-2023 (rot L 40\u00b0, R 55\u00b0, Spurling+). MRI: protrusie C5\u2013C6."},
        {label:"Neurologisch bovenste extremiteiten", context:"EMG: ulnaris neuropathie elleboog L (42 m/s, N>50). Hypoesthesie C6 L, sensibiliteitsverlies dig IV\u2013V."},
        {label:"Provocatietesten", context:"Spurling positief L (neuroloog 08-03-2023)."},
        {label:"Aanvullend onderzoek", context:null}
      ]
    },
    {
      num:"8", title:"Diagnose en beschouwing", badge:"arts", type:"arts_template",
      prompt:"Per subveld zijn de relevante dossiergegevens samengevat. Zie ook tegenstrijdigheden (sectie 5b).",
      subfields: [
        {label:"Diagnose op vakgebied", context:"Neuroloog: (1) cervicobrachialgie C5\u2013C6, (2) ulnaris neuropathie, (3) PCS. Zie sectie 5b."},
        {label:"Causaal verband", context:"CT SEH: spondylose pre-existent. MRI: protrusie. Neuroloog: traumatisch geagraveerd. EMG: causaliteit open. \u2192 Zie tegenstrijdigheden 5b."},
        {label:"Pre-existente factoren", context:"Spondylose C5\u2013C6 + L4\u2013L5 (CT/r\u00f6ntgen). Geen klachten in huisartsjournaal v\u00f3\u00f3r ongeval."},
        {label:"Prognose en eindtoestand", context:"Neuroloog: PCS-herstel 6\u201312 mnd. Bedrijfsarts: volledige werkhervatting niet voor sept 2023. Huidig (apr 2024): 40% AO."},
        {label:"Blijvende invaliditeit (AMA Guides 6e ed.)", context:"Relevante chapters: Ch.17 Spine (Table 17-2 Cervical DBI) voor cervicaal syndroom. Ch.15 Upper Extremities (Table 15-5 Clavicle/AC) voor AC-luxatie. Ch.13 CNS/PNS (Table 13-12 Peripheral Nerve) voor ulnaris neuropathie. Ch.13 (Table 13-6 TBI) voor PCS."}
      ]
    },
    {
      num:"9", title:"Beantwoording IWMD-vragen", badge:"arts", type:"iwmd_answers",
      intro:"Beantwoording conform IWMD-richtlijnen. Per vraag is de relevante dossiercontext samengevat.",
      questions: [
        {q:"Vraag 1 \u2014 Anamnese: aard, ernst, verloop letsel en behandelingen?", context:"Zie secties 4 en 6 voor AI-voorbereiding."},
        {q:"Vraag 2 \u2014 Medische voorgeschiedenis op uw vakgebied?", context:"Zie sectie 3."},
        {q:"Vraag 3 \u2014 Bevindingen bij lichamelijk en hulponderzoek?", context:null},
        {q:"Vraag 4 \u2014 Diagnose en differentiaaldiagnostische overwegingen?", context:null},
        {q:"Vraag 5 \u2014 Causaal verband klachten/stoornissen met ongeval?", context:"Aandacht: 3 tegenstrijdigheden (sectie 5b). Pre-existente spondylose vs. traumatische agravatie."},
        {q:"Vraag 6 \u2014 Eindtoestand? Zo ja, per welke datum?", context:"Neuroloog: PCS 6\u201312 mnd. 26 mnd post-trauma, klachten persisteren."},
        {q:"Vraag 7 \u2014 Beperkingen in huidige toestand (incl. FML)?", context:"Bedrijfsarts: max 4u/dag, beperkt bovenhands, pijn zitten >45 min. AMA Guides 6e ed.: Ch.17 Table 17-2 (cervicaal), Ch.15 Table 15-5 (AC-luxatie), Ch.13 Table 13-12 (ulnaris), Ch.13 Table 13-6 (PCS)."},
        {q:"Vraag 8 \u2014 Beperkingen toe te schrijven aan ongeval? Pre-existent?", context:"Kritiek: zie tegenstrijdigheid 1 (sectie 5b). Spondylose pre-existent, geen klachten gedocumenteerd."},
        {q:"Vraag 9 \u2014 Therapeutische suggesties?", context:null},
        {q:"Vraag 10 \u2014 Overige relevante feiten of omstandigheden?", context:"3 hiaten (sectie 5a), 3 tegenstrijdigheden (sectie 5b)."}
      ]
    },
    {
      num:"10", title:"Bronnenlijst", badge:"ai", type:"bronnen",
      bronnen: [
        {nr:"1", doc:"SEH-verslag", bron:"[ORGANISATIE-2]", datum:"29-01-2022", paginas:"1\u20132"},
        {nr:"2", doc:"Huisartsbrief", bron:"[ORGANISATIE-1]", datum:"14-02-2022", paginas:"1"},
        {nr:"3", doc:"Fysiotherapie intake", bron:"[ORGANISATIE-6]", datum:"21-02-2022", paginas:"3"},
        {nr:"4", doc:"Huisartsjournaal", bron:"[ORGANISATIE-1]", datum:"2018\u20132022", paginas:"1\u20133"},
        {nr:"5", doc:"MRI cervicaal", bron:"Radiologie [ORGANISATIE-2]", datum:"18-08-2022", paginas:"1"},
        {nr:"6", doc:"Verwijsbrief pijnrevalidatie", bron:"[ORGANISATIE-7]", datum:"12-10-2022", paginas:"1\u20132"},
        {nr:"7", doc:"Operatieverslag denervatie", bron:"Anesthesiologie", datum:"15-01-2023", paginas:"1"},
        {nr:"8", doc:"Intake CGT", bron:"[ORGANISATIE-8]", datum:"08-03-2023", paginas:"1\u20132"},
        {nr:"9", doc:"Keuringsrapport", bron:"[ORGANISATIE-4]", datum:"14-09-2020", paginas:"1"},
        {nr:"10", doc:"Expertiseonderzoek", bron:"[ORGANISATIE-5]", datum:"23-04-2024", paginas:"4\u20136"}
      ]
    }
  ],
  stats: {aiSections:8, artsSections:3, bronnen:10, hiaten:3, tegenstrijdigheden:3}
};


function prioColor(p){return p==="kritiek"?"#D94F4F":p==="belangrijk"?"#C77B2E":"var(--warm-teal)";}
function prioLabel(p){return p==="kritiek"?"Kritiek":p==="belangrijk"?"Belangrijk":"Aandacht";}
function sevColor(s){return s==="kritiek"?"#D94F4F":s==="belangrijk"?"#C77B2E":"var(--warm-teal)";}
function sevLabel(s){return s==="kritiek"?"Kritiek":s==="belangrijk"?"Belangrijk":"Aandacht";}

function renderRapport(data){
var o=document.getElementById("output");
var h='<div class="rapport">';

// Header
h+='<div class="rapport-header">';
h+='<div class="rapport-meta"><span class="rapport-meta-label">Zaaknummer</span><span class="rapport-meta-value">'+esc(data.meta.zaaknummer)+'</span></div>';
h+='<div class="rapport-meta"><span class="rapport-meta-label">Betrokkene</span><span class="rapport-meta-value rapport-meta-redacted">'+esc(data.meta.betrokkene)+'</span></div>';
h+='<div class="rapport-meta"><span class="rapport-meta-label">Specialisme</span><span class="rapport-meta-value">'+esc(data.meta.specialisme)+'</span></div>';
h+='<div class="rapport-meta"><span class="rapport-meta-label">Status</span><span class="rapport-status">'+esc(data.meta.status)+'</span></div>';
h+='</div>';

// Completeness bar
if(data.compleetheid){
var sc=data.compleetheid.score;
var col=sc>=90?'var(--warm-teal)':sc>=70?'#C77B2E':'#D94F4F';
h+='<div class="rp-completeness">';
h+='<div class="rp-compl-header"><span class="rp-compl-title">Dossiercompleetheid</span><span class="rp-compl-score" style="color:'+col+'">'+sc+'%</span></div>';
h+='<div class="rp-compl-bar"><div class="rp-compl-fill" style="width:'+sc+'%;background:'+col+'"></div></div>';
h+='<div class="rp-compl-detail">';
h+='<div class="rp-compl-col"><span class="rp-compl-label">Aanwezig ('+data.compleetheid.aanwezig.length+')</span>';
data.compleetheid.aanwezig.forEach(function(d){var t=typeof d==="string"?d:d.doc;h+='<span class="rp-compl-item rp-compl-ok">'+esc(t)+'</span>';});
h+='</div>';
h+='<div class="rp-compl-col"><span class="rp-compl-label">Ontbrekend ('+data.compleetheid.ontbrekend.length+')</span>';
data.compleetheid.ontbrekend.forEach(function(d){
var t=typeof d==="string"?d:d.doc;
var p=(typeof d==="object"&&d.prio)?d.prio:"aandacht";
h+='<span class="rp-compl-item rp-compl-miss"><span class="rp-prio-dot" style="background:'+prioColor(p)+'"></span>'+esc(t)+'</span>';
});
h+='</div>';
h+='</div></div>';
}

h+='<div class="rapport-body">';
h+='<div class="rapport-title">Concept Medisch Expertiserapport</div>';
h+='<div class="rapport-subtitle">IWMD '+esc(data.meta.specialisme)+' \u2014 AI-voorbereiding door Kinetic</div>';

// Sections
data.sections.forEach(function(s){
h+='<div class="rp-section">';
h+='<div class="rp-section-num">Sectie '+esc(s.num)+'</div>';
h+='<h3 class="rp-section-title">'+esc(s.title);
if(s.badge==="ai")h+='<span class="rp-badge rp-badge-ai">AI-voorbereid</span>';
else h+='<span class="rp-badge rp-badge-arts">Arts</span>';
h+='</h3>';

// Fields
if(s.type==="fields"){
s.fields.forEach(function(f){
h+='<div class="rp-field"><span class="rp-field-label">'+esc(f.label)+'</span><span class="rp-field-value'+(f.redacted?' rp-field-redacted':'')+'">'+esc(f.value)+'</span></div>';
});
}

// IWMD questions (section 2)
if(s.type==="iwmd"){
h+='<p class="rp-text">'+esc(s.intro)+'</p>';
s.questions.forEach(function(q,i){
h+='<div class="rp-question"><span class="rp-q-num">Vraag '+(i+1)+'</span><p class="rp-q-text">'+esc(q)+'</p></div>';
});
}

// Text
if(s.type==="text"){
s.paragraphs.forEach(function(p){
h+='<p class="rp-text">'+esc(p).replace(/\n/g,'<br>')+'</p>';
});
if(s.sources&&s.sources.length){
h+='<div class="rp-sources"><div class="rp-sources-title">Bronverwijzingen</div>';
s.sources.forEach(function(src){h+='<div class="rp-source-item">'+esc(src)+'</div>';});
h+='</div>';
}
}

// Hiaten with priority
if(s.type==="hiaten"){
s.hiaten.forEach(function(hi){
var p=hi.prio||"aandacht";
var pc=prioColor(p);
h+='<div class="rp-hiaat" style="border-color:'+pc+'22">';
h+='<div class="rp-hiaat-header">';
h+='<span class="rp-hiaat-status" style="background:'+pc+'">'+prioLabel(p)+'</span>';
h+='<span class="rp-hiaat-doc">'+esc(hi.doc)+'</span>';
h+='<span class="rp-hiaat-verwacht">Verwacht: '+esc(hi.verwacht)+'</span>';
h+='</div>';
h+='<p class="rp-hiaat-text">'+esc(hi.toelichting)+'</p>';
h+='<div class="rp-hiaat-actie" style="background:'+pc+'0a"><span class="rp-hiaat-actie-label">Actie:</span> '+esc(hi.actie)+'</div>';
h+='</div>';
});
}

// Tegenstrijdigheden with severity
if(s.type==="tegenstrijdigheden"){
s.items.forEach(function(item){
var sv=item.severity||"aandacht";
var sc=sevColor(sv);
h+='<div class="rp-contra" style="border-color:'+sc+'22">';
h+='<div class="rp-contra-header"><span class="rp-contra-sev" style="background:'+sc+'">'+sevLabel(sv)+'</span><span class="rp-contra-thema">'+esc(item.thema)+'</span></div>';
h+='<div class="rp-contra-bronnen">';
item.bronnen.forEach(function(b){h+='<div class="rp-contra-bron" style="border-left-color:'+sc+'44">'+esc(b)+'</div>';});
h+='</div>';
h+='<div class="rp-contra-relevantie" style="background:'+sc+'0a"><span class="rp-contra-rel-label">Relevantie:</span> '+esc(item.relevantie)+'</div>';
h+='</div>';
});
}

// Arts template with compact context
if(s.type==="arts_template"){
h+='<div class="rp-arts-template">';
h+='<p class="rp-arts-prompt">'+esc(s.prompt)+'</p>';
s.subfields.forEach(function(sf){
var label=typeof sf==="string"?sf:sf.label;
var ctx=typeof sf==="string"?null:sf.context;
h+='<div class="rp-arts-field"><span class="rp-arts-label">Arts</span><strong>'+esc(label)+'</strong>';
if(ctx){h+='<div class="rp-arts-context"><span class="rp-arts-ctx-label">Dossier:</span> '+esc(ctx)+'</div>';}
h+='</div>';
});
h+='</div>';
}

// IWMD answers with compact context
if(s.type==="iwmd_answers"){
h+='<p class="rp-text">'+esc(s.intro)+'</p>';
s.questions.forEach(function(item,i){
var q=typeof item==="string"?item:item.q;
var ctx=typeof item==="string"?null:item.context;
h+='<div class="rp-question"><span class="rp-q-num">'+(q.indexOf("Vraag")===0?"":"Vraag "+(i+1))+'</span><p class="rp-q-text">'+esc(q.replace(/^Vraag \d+ \u2014 /,""))+'</p>';
if(ctx){h+='<div class="rp-arts-context"><span class="rp-arts-ctx-label">Dossier:</span> '+esc(ctx)+'</div>';}
h+='<div class="rp-arts-field"><span class="rp-arts-label">Arts</span></div></div>';
});
}

// Bronnenlijst
if(s.type==="bronnen"){
h+='<table class="rp-bronnen-table"><thead><tr><th>Nr.</th><th>Document</th><th>Bron</th><th>Datum</th><th>Pag.</th></tr></thead><tbody>';
s.bronnen.forEach(function(b){
h+='<tr><td>'+esc(b.nr)+'</td><td>'+esc(b.doc)+'</td><td>'+esc(b.bron)+'</td><td>'+esc(b.datum)+'</td><td>'+esc(b.paginas)+'</td></tr>';
});
h+='</tbody></table>';
}

h+='</div>';
});

h+='<div class="rp-page">p. 1\u201314</div>';
h+='</div>';
h+='<div class="rp-disclaimer"><strong>Fragment uit concept-rapport.</strong><br>AI ondersteunt bij ordening en bronverwijzing; de BIG-geregistreerde specialist beoordeelt en autoriseert het definitieve rapport.</div>';
h+='</div>';

// Stats
h+='<div class="rp-summary">';
h+='<div class="rp-stat"><div class="rp-stat-val">'+data.stats.aiSections+'</div><div class="rp-stat-lbl">AI-voorbereid</div></div>';
h+='<div class="rp-stat"><div class="rp-stat-val">'+data.stats.artsSections+'</div><div class="rp-stat-lbl">Arts-secties</div></div>';
h+='<div class="rp-stat"><div class="rp-stat-val">'+data.stats.bronnen+'</div><div class="rp-stat-lbl">Bronverwijzingen</div></div>';
h+='<div class="rp-stat"><div class="rp-stat-val" style="color:#D94F4F">'+data.stats.hiaten+'</div><div class="rp-stat-lbl">Hiaten</div></div>';
h+='<div class="rp-stat"><div class="rp-stat-val" style="color:#C77B2E">'+(data.stats.tegenstrijdigheden||0)+'</div><div class="rp-stat-lbl">Aandachtspunten</div></div>';
h+='</div>';

o.innerHTML=h;
}

var currentMode="example";
function setMode(mode){
currentMode=mode;
document.getElementById("modeExample").classList.toggle("active",mode==="example");
document.getElementById("modeCustom").classList.toggle("active",mode==="custom");
document.getElementById("inputPanel").classList.toggle("hidden",mode==="example");
if(mode==="example"){renderRapport(EXAMPLE_RAPPORT);}
else{document.getElementById("output").innerHTML='<div style="text-align:center;padding:3rem;color:var(--stone)"><p>Plak een gepseudonimiseerd medisch dossier hierboven en klik op <strong>Genereer concept-rapport</strong>.</p></div>';}
}

async function generateRapport(){
var text=document.getElementById("customInput").value.trim();
if(!text)return;
var btn=document.getElementById("extractBtn");
btn.disabled=true;
btn.innerHTML='<span class="spinner"></span>Verwerken\u2026';
document.getElementById("output").innerHTML='<div style="text-align:center;padding:3rem;color:var(--stone)"><div class="spinner" style="border-color:rgba(47,111,106,.2);border-top-color:var(--warm-teal);width:24px;height:24px;margin:0 auto"></div><p style="margin-top:1rem">AI genereert concept-rapport\u2026</p></div>';
try{
var content=await window.Kinetic.generate("rapport",text,"Je bent een medisch dossier-analist voor letselschade-expertises. Genereer een concept IWMD expertiserapport.\n\nREGELS:\n- Gebruik EXACT de officiele IWMD-vraagstelling (10 vragen, letterlijke tekst)\n- AI-secties: gegevens, vraagstelling, voorgeschiedenis, toedracht, samenvatting, klachten, bronnenlijst\n- Arts-secties: lichamelijk onderzoek, diagnose/beschouwing, beantwoording IWMD-vragen\n- Hiaten: prioriteit per item (kritiek/belangrijk/wenselijk). Kritiek = nodig voor expertise. Belangrijk = versterkt rapport. Wenselijk = nice to have.\n- Tegenstrijdigheden: severity per item (kritiek/belangrijk/aandacht). Signaleer ALTIJD pre-existent vs traumatisch discussies.\n- Arts-templates: compact dossiercontext per subveld (max 2 regels feiten + bronverwijzing). Geen lange verhalen.\n- IWMD-vragen: gebruik de officiele IWMD-tekst. Voeg per vraag compacte dossiercontext toe (max 1-2 regels).\n- Dossiercompleetheid: bereken score, lijst aanwezige docs (strings), ontbrekende docs met prio (objects: {doc,prio}).\n- Bronnenlijst als laatste sectie.\n- Gebruik [PERSOON-N] en [ORGANISATIE-N] placeholders.\n\nKRITIEK: ALLEEN valide JSON. Geen markdown. Dubbele aanhalingstekens. Geen trailing commas.\n\nOfficiele IWMD-vragen (gebruik LETTERLIJK):\n1. Hoe luidt de anamnese voor wat betreft de aard en de ernst van het letsel, het verloop van de klachten, de toegepaste behandelingen en het resultaat van deze behandelingen?\n2. Wilt u op basis van het medisch dossier een beschrijving geven van de medische voorgeschiedenis op uw vakgebied?\n3. Wilt u een beschrijving geven van uw bevindingen bij lichamelijk en eventueel hulponderzoek?\n4. Wat is de diagnose op uw vakgebied? Wilt u daarbij differentiaal diagnostische overwegingen geven?\n5. Bestaat er een causaal verband met het ongeval?\n6. Is de huidige toestand als eindtoestand te beschouwen?\n7. Welke beperkingen bestaan bij betrokkene in zijn huidige toestand?\n8. Zijn beperkingen toe te schrijven aan het ongeval? Pre-existent?\n9. Heeft u therapeutische suggesties?\n10. Overige relevante feiten of omstandigheden?\n\nAMA GUIDES 6e EDITIE - DIAGNOSE-CHAPTER MAPPING:\nVoeg bij invaliditeits-velden de relevante AMA chapter/tabel referenties toe:\n- Cervicaal/lumbaal: Ch.17 Spine, Table 17-2 (Cervical) of 17-4 (Lumbar)\n- Schouder/AC-luxatie: Ch.15 Upper Ext, Table 15-5\n- Knie: Ch.16 Lower Ext, Table 16-3\n- Perifere zenuw: Ch.13, Table 13-12\n- Hersenletsel/PCS: Ch.13, Table 13-6 + 13-8\n- PTSS: Ch.14 Mental Disorders\n- Pijn: Ch.3 Pain\n\nJSON structuur:\n{\"meta\":{\"zaaknummer\":\"\",\"betrokkene\":\"\",\"geboortedatum\":\"\",\"status\":\"Concept\",\"specialisme\":\"\",\"opdrachtgever\":\"\",\"ongevalsdatum\":\"\",\"onderzoeksdatum\":\"\"},\"compleetheid\":{\"score\":0,\"aanwezig\":[\"string\"],\"ontbrekend\":[{\"doc\":\"string\",\"prio\":\"kritiek|belangrijk|wenselijk\"}]},\"sections\":[{\"num\":\"1\",\"title\":\"\",\"badge\":\"ai|arts\",\"type\":\"fields|text|iwmd|hiaten|tegenstrijdigheden|arts_template|iwmd_answers|bronnen\",\"fields\":[{\"label\":\"\",\"value\":\"\",\"redacted\":false}],\"paragraphs\":[\"\"],\"sources\":[\"\"],\"hiaten\":[{\"status\":\"ontbrekend\",\"prio\":\"kritiek|belangrijk|wenselijk\",\"doc\":\"\",\"verwacht\":\"\",\"toelichting\":\"\",\"actie\":\"\"}],\"items\":[{\"thema\":\"\",\"severity\":\"kritiek|belangrijk|aandacht\",\"bronnen\":[\"\"],\"relevantie\":\"\"}],\"prompt\":\"\",\"subfields\":[{\"label\":\"\",\"context\":\"\"}],\"intro\":\"\",\"questions\":[{\"q\":\"\",\"context\":\"\"}],\"bronnen\":[{\"nr\":\"\",\"doc\":\"\",\"bron\":\"\",\"datum\":\"\",\"paginas\":\"\"}]}],\"stats\":{\"aiSections\":0,\"artsSections\":0,\"bronnen\":0,\"hiaten\":0,\"tegenstrijdigheden\":0}}\n\nDossier:\n\n");
content=content.replace(/```json|```/g,"").trim();
var si=content.indexOf("{");var ei=content.lastIndexOf("}");
if(si>=0&&ei>si)content=content.substring(si,ei+1);
content=content.replace(/,\s*([}\]])/g,"$1");
content=content.replace(/[\x00-\x1f]/g,function(c){if(c==="\n"||c==="\r"||c==="\t")return c;return"";});
try{var parsed=JSON.parse(content);}catch(e1){
content=content.replace(/\n/g," ").replace(/\r/g," ").replace(/\t/g," ");
content=content.replace(/,\s*([}\]])/g,"$1");
var parsed=JSON.parse(content);
}
renderRapport(parsed);
}catch(err){
var msg=(err.message.indexOf("Failed to fetch")>=0||err.message.indexOf("NetworkError")>=0||err.message.indexOf("CORS")>=0)?"De AI-service is momenteel niet bereikbaar. Controleer je verbinding en probeer het opnieuw.":"Controleer of de tekst een geldig (gepseudonimiseerd) medisch dossier bevat.";
document.getElementById("output").innerHTML='<div style="text-align:center;padding:3rem;color:#D94F4F"><p><strong>Fout bij verwerking:</strong> '+esc(err.message)+'</p><p style="margin-top:.5rem;color:var(--stone)">'+msg+'</p></div>';
}
btn.disabled=false;
btn.innerHTML="Genereer concept-rapport";
}

function init(){
document.getElementById("modeExample").addEventListener("click",function(){setMode("example");});
document.getElementById("modeCustom").addEventListener("click",function(){setMode("custom");});
document.getElementById("extractBtn").addEventListener("click",generateRapport);
renderRapport(EXAMPLE_RAPPORT);
}

if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();
