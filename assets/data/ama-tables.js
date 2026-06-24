/* ==========================================================================
   AMA Guides 6e editie — gedigitaliseerde tabellen als data-module.
   Bron: ama-tables-digitized.md. Per tabel een tekstblok dat in de
   Mistral-prompt kan worden meegestuurd voor een voorlopige impairment rating.

   Exposeert window.Kinetic.AMA_TABLES (data) en — in een tweede stap —
   selectAMATables()/amaPromptBlock() (selectielogica).

   Ontbrekende tabellen hebben text:null + een `missing`-marker zodat ze later
   kunnen worden toegevoegd zonder de rest te wijzigen.
   ========================================================================== */
(function () {
"use strict";
window.Kinetic = window.Kinetic || {};

var AMA_TABLES = {

  ch02_method: {
    title: "Chapter 2 — Net Adjustment Formula & Grade Assignments",
    always: true,
    text:
"Net Adjustment = (GMFH - CDX) + (GMPE - CDX) + (GMCS - CDX)\n" +
"  CDX  = Class of Diagnosis (uit Regional Grid)\n" +
"  GMFH = Grade Modifier Functional History\n" +
"  GMPE = Grade Modifier Physical Examination\n" +
"  GMCS = Grade Modifier Clinical Studies\n" +
"Grade (vanaf default C): -2=A, -1=B, 0=C(default), +1=D, +2=E.\n" +
"Als alle grade modifiers gelijk zijn aan CDX -> net adjustment 0 -> Grade C.\n" +
"Een verandering van CLASS is NIET toegestaan; alleen beweging binnen de class (A-E)."
  },

  ch17_cervical: {
    title: "Table 17-2 — Cervical Spine Regional Grid (DBI)",
    text:
"Soft Tissue / Non-Specific:\n" +
"  Class 0 | 0% | sprain/strain zonder objectieve bevindingen\n" +
"  Class 1 | 1%-8% (default 3) | aanhoudende klachten, niet-verifieerbare radiculaire klachten\n" +
"  Class 2 | 9%-14% (default 11) | gedocumenteerde radiculopathie op klinisch passend niveau\n" +
"  Class 3 | 15%-24% (default 18) | radiculopathie op één klinisch passend niveau\n" +
"  Class 4 | 25%-30% (default 27) | bilaterale of multilevel radiculopathie\n" +
"Intervertebral Disk Herniation / AOMSI:\n" +
"  Class 0 | 0% | imaging-bevinding zonder radiculaire symptomen\n" +
"  Class 1 | 1%-8% (default 5) | HNP/AOMSI single level, gedocumenteerd; met/zonder chirurgie\n" +
"  Class 2 | 9%-14% (default 11) | HNP/AOMSI multilevel, gedocumenteerd; met/zonder chirurgie\n" +
"  Class 3 | 15%-24% (default 18) | HNP met residuale radiculopathie single level\n" +
"  Class 4 | 25%-30% (default 27) | bilaterale/multilevel radiculopathie\n" +
"Fracture/Dislocation:\n" +
"  Class 0 | 0% | geheeld, geen restverschijnselen\n" +
"  Class 1 | 1%-8% (default 4) | single-level (sub)luxatie/fractuur, geheeld\n" +
"  Class 2 | 9%-14% (default 11) | met radiculopathie klinisch passend niveau\n" +
"  Class 3 | 15%-24% (default 18) | radiculopathie single level\n" +
"  Class 4 | 25%-30% (default 28) | bilaterale/multilevel radiculopathie"
  },

  ch17_thoracic: {
    title: "Table 17-3 — Thoracic Spine Regional Grid (DBI)",
    text: null,
    missing: "[TABEL 17-3 ONTBREEKT — thoracale grid niet gedigitaliseerd; handmatige beoordeling door arts vereist]"
  },

  ch17_lumbar: {
    title: "Table 17-4 — Lumbar Spine Regional Grid (DBI)",
    text:
"Soft Tissue / Non-Specific:\n" +
"  Class 0 | 0% | sprain/strain zonder objectieve bevindingen\n" +
"  Class 1 | 1%-9% (default 2) | aanhoudende axiale/niet-verifieerbare radiculaire klachten\n" +
"  Class 2 | 10%-14% (default 12) | radiculopathie klinisch passend niveau\n" +
"  Class 3 | 15%-24% (default 18) | radiculopathie single level\n" +
"  Class 4 | 25%-33% (default 28) | bilaterale/multilevel radiculopathie\n" +
"Intervertebral Disk / Stenosis:\n" +
"  Class 0 | 0% | imaging zonder correlerende symptomen\n" +
"  Class 1 | 1%-9% (default 6) | single level gedocumenteerd; met/zonder chirurgie\n" +
"  Class 2 | 10%-14% (default 12) | multilevel; of single level met neurogene claudicatio\n" +
"  Class 3 | 15%-24% (default 18) | radiculopathie single level\n" +
"  Class 4 | 25%-33% (default 28) | bilaterale/multilevel radiculopathie; of cauda equina\n" +
"Spondylolisthesis:\n" +
"  Class 1 | 1%-9% (default 7) | gedocumenteerd letsel; met/zonder chirurgie\n" +
"  Class 2 | 10%-14% (default 12) | radiculopathie single level\n" +
"  Class 3 | 15%-24% (default 18) | multilevel; met/zonder chirurgie\n" +
"  Class 4 | 25%-33% (default 28) | radiculopathie; chirurgie multilevel"
  },

  ch17_fh: {
    title: "Table 17-6 — Functional History Adjustment: Spine (Grade Modifier 1)",
    text: null,
    missing: "[TABEL 17-6 ONTBREEKT — handmatige beoordeling GMFH door arts vereist]",
    fallback:
"Generieke GMFH-beschrijving (workaround):\n" +
"  GM 0: geen klachten\n" +
"  GM 1: milde klachten bij zware activiteit\n" +
"  GM 2: matige klachten bij normale activiteit, medicatie nodig\n" +
"  GM 3: ernstige klachten bij minder dan normale activiteit, hulp nodig\n" +
"  GM 4: klachten in rust, niet in staat tot zelfzorg"
  },

  ch17_pe: {
    title: "Table 17-7 — Physical Examination Adjustment: Spine (Grade Modifier 2)",
    text:
"GM op basis van: SLR/cervicale compressie, reflexen, atrofie (UE/LE), sensibiliteit, motoriek.\n" +
"  Atrofie: GM1 1.0-1.9cm, GM2 2.0-2.9cm, GM3 3.0-3.5cm, GM4 >3.5cm\n" +
"  Motoriek: GM0 5/5, GM1 4/5, GM2 3/5, GM3 2/5, GM4 1/5\n" +
"  Sensibiliteit: oplopend van normaal (GM0) tot afwezige protectieve sensibiliteit (GM4)\n" +
"  Provocatie: GM1 positief met uitstraling 35-70°, GM2 reproduceerbare radiculaire pijn"
  },

  ch17_cs: {
    title: "Table 17-9 — Clinical Studies Adjustment: Spine (Grade Modifier 3)",
    text:
"GM op basis van imaging en elektrodiagnostiek.\n" +
"  GM0: imaging normaal/leeftijdsgebonden, niet ondersteunend\n" +
"  GM1: imaging consistent met klinisch beeld\n" +
"  GM2: EMG consistent met enkele zenuwwortel; AOMSI met segmentale instabiliteit\n" +
"  GM3: functional imaging consistent met AOMSI/segmentale instabiliteit\n" +
"  GM4: imaging consistent met multilevel radiculopathie"
  },

  ch15_shoulder: {
    title: "Table 15-5 — Shoulder Regional Grid (DBI)",
    text:
"Soft Tissue:\n" +
"  Class 0 | 0% | geen significante symptomen bij MMI\n" +
"  Class 1 | 1%-13% (default 1) | pijnlijk letsel, restklachten zonder consistente objectieve bevindingen\n" +
"Muscle/Tendon (grade-waarden a,b,c,d,e per class):\n" +
"  Rotator cuff partial tear: Class 1 = 0,1,1,2,2\n" +
"  Rotator cuff full tear: Class 1 = 1,2,3,4,5\n" +
"  Tendinitis: Class 1 = 0,0,1,1,2 (default 1)\n" +
"Ligament/Bone/Joint:\n" +
"  AC joint injury: Class 1 = 0,1,1,2,2 ; Type IV+ Class 2 = 16,18,20,22,24\n" +
"  Clavicula fractuur (distaal): Class 1 = 1,2,3,4,5 ; Type III = 8,9,10,11,12\n" +
"  Fractuur: Class 1 = 1,2,3,4,5 (of 3,4,5,6,7 bij residual loss)\n" +
"  Arthroplastiek: oplopend tot Class 4 = 34,37,40,43,46\n" +
"(Waarden zijn % UE-impairment; converteer naar WPI via UE->WPI factor.)"
  },

  ch15_elbow: {
    title: "Table 15-4 — Elbow Regional Grid (DBI)",
    text: null,
    missing: "[TABEL 15-4 ONTBREEKT — elleboog-grid niet gedigitaliseerd; handmatige beoordeling vereist]"
  },

  ch15_wrist: {
    title: "Table 15-3 — Wrist Regional Grid (DBI)",
    text: null,
    missing: "[TABEL 15-3 ONTBREEKT — pols-grid niet gedigitaliseerd; handmatige beoordeling vereist]"
  },

  ch15_fh: {
    title: "Table 15-7 — Functional History Adjustment: UE (Grade Modifier 1)",
    text:
"GM op basis van QuickDASH-score:\n" +
"  GM0 0-20 (asymptomatisch); GM1 21-40 (mild); GM2 41-60 (matig, medicatie);\n" +
"  GM3 61-80 (ernstig, hulp bij zelfzorg); GM4 81-100 (zeer ernstig)"
  },

  ch15_pe: {
    title: "Table 15-8 — Physical Examination Adjustment: UE (Grade Modifier 2)",
    text:
"GM op basis van palpatie, ROM, atrofie.\n" +
"  Atrofie: GM1 1.0-1.9cm, GM2 2.0-2.9cm, GM3 3.0-3.9cm, GM4 4.0cm+\n" +
"  ROM: GM1 milde afname ... GM4 (vrijwel) volledig verlies"
  },

  ch15_cs: {
    title: "Table 15-9 — Clinical Studies Adjustment: UE (Grade Modifier 3)",
    text:
"GM op basis van imaging (schouder) en zenuwgeleiding.\n" +
"  Imaging: GM1 milde ... GM4 zeer ernstige pathologie bevestigd\n" +
"  Zenuwgeleiding: GM0 normaal, GM1 conductievertraging, GM2 motorisch geleidingsblok"
  },

  ch15_nerve: {
    title: "Table 15-21/23 — Peripheral Nerve Impairment: UE",
    text: null,
    missing: "[TABEL 15-21/23 ONTBREEKT — perifere zenuw-grid UE niet gedigitaliseerd; handmatige beoordeling vereist]"
  },

  ch16_knee: {
    title: "Table 16-3 — Knee Regional Grid (DBI)",
    text:
"Grade-waarden a,b,c,d per class waar van toepassing.\n" +
"  Soft tissue (bursitis/contusie): Class 1 = 0,1,1,2\n" +
"  Muscle/tendon (strain/ruptuur): Class 1 = 1,2,2,3 / 5,6,7,8,9 / 7,8,10,12,13\n" +
"  Meniscusletsel: Class 1 = 1,2,2,3 (partiële meniscectomie) / 5,6,7,8,9 (totale) ; Class 2 = 19,20,22,24,25\n" +
"  Kruisband/collateraal: Class 1 geen instabiliteit -> Class 4 ernstige laxiteit\n" +
"  Fractuur (proximale tibia): Class 1 = 3,4,5,6 (<10°) ; Class 2 = 14,17,19,21,24 (10-19°) ; Class 3 = 26,28,30,32,34 (20°+) ; Class 4 = 52,56,60,64,68 (non-union)\n" +
"  Artrose primair kniegewricht: Class 2 = 16,18,20,22,24 ; Class 3 = 31,34,37,40,43\n" +
"  Totale/partiële knieprothese: 21,23,25,25 (goed) oplopend tot 52,56,60,64,68 (slecht)"
  },

  ch16_hip: {
    title: "Table 16-4 — Hip Regional Grid (DBI)",
    text: null,
    missing: "[TABEL 16-4 ONTBREEKT — heup-grid niet gedigitaliseerd; handmatige beoordeling vereist]"
  },

  ch16_ankle: {
    title: "Table 16-2 — Foot and Ankle Regional Grid (DBI)",
    text:
"Grade-waarden a,b,c,d,e per class.\n" +
"  Enkelfractuur (neutraal): Class 1 = 7,8,10,12,13 ; Class 2 = 16,18,20,22,24 ; Class 3 = 26,28,30,32,34 ; Class 4 = 52,56,60,64,68\n" +
"  Subtalair / arthrodese: idem reeksen\n" +
"  Calcaneusfractuur: Class 1 = 7,8,10,12,13 ; Class 2 = 14,15,16,17,18 ; Class 3 = 26,28,30,32,34\n" +
"  Totale enkelprothese: 21,23,25,25 (goed) ... 59,63,67,71,75 (slecht)\n" +
"  Achilles/pees: Class 1 = 0,1,1,2,2 / 3,4,5,6,7 (milde motiebeperking)"
  },

  ch16_fh: {
    title: "Table 16-6 — Functional History Adjustment: LE (Grade Modifier 1)",
    text:
"GM op basis van AAOS/SMFA-inventory:\n" +
"  GM0 geen probleem; GM1 antalgisch hinken/schoenmodificatie; GM2 orthese;\n" +
"  GM3 loophulpmiddelen (2 krukken/KAFO); GM4 niet-ambulant"
  },

  ch16_pe: {
    title: "Table 16-7 — Physical Examination Adjustment: LE (Grade Modifier 2)",
    text:
"GM op basis van palpatie, ROM, knie-stabiliteit, atrofie, beenlengteverschil.\n" +
"  Atrofie: GM1 1.0-1.9cm, GM2 2.0-2.9cm, GM3 3.0-3.9cm, GM4 4.0cm+\n" +
"  Knie-stabiliteit: GM1 grade 1 (licht) ... GM4 grove/multidirectionele instabiliteit\n" +
"  Beenlengteverschil: GM1 2.0-2.9cm, GM2 3.0-3.9cm, GM4 6.0cm+"
  },

  ch16_cs: {
    title: "Table 16-8 — Clinical Studies Adjustment: LE (Grade Modifier 3)",
    text: null,
    missing: "[TABEL 16-8 ONTBREEKT — LE clinical studies grid niet gedigitaliseerd; handmatige beoordeling vereist]"
  },

  ch13_tbi: {
    title: "Table 13-8 — TBI DBI",
    text:
"Class | WPI | beschrijving (MSCHF = mental status/cognitive/higher function)\n" +
"  Class 0 | 0% | normaal MSCHF\n" +
"  Class 1 | 1%-10% | alteratie MSCHF, kan alle normale rollen/ADL\n" +
"  Class 2 | 11%-20% | interfereert met sommige rollen/ADL\n" +
"  Class 3 | 21%-35% | interfereert significant met rollen/ADL\n" +
"  Class 4 | 36%-50% | verhindert normale rollen/ADL"
  },

  ch13_consciousness: {
    title: "Table 13-4 — Consciousness and Awareness",
    text:
"  Class 0 | 0% | geen alteratie bewustzijn/ADL\n" +
"  Class 1 | 1%-10% | kortdurende/persisterende alteratie, minimale ADL-beperking\n" +
"  Class 2 | 11%-30% | matige ADL-beperking\n" +
"  Class 3 | 31%-50% | langdurige alteratie, afhankelijk bij ADL\n" +
"  Class 4 | 51%-100% | semi-coma/coma, totale afhankelijkheid"
  },

  ch13_emotional: {
    title: "Table 13-22 — Emotional/Behavioral Sequelae of TBI",
    text: null,
    missing: "[TABEL 13-22 ONTBREEKT — gedragsmatige gevolgen TBI niet te berekenen, handmatige beoordeling door arts vereist]"
  },

  ch03_pain: {
    title: "Table 3-1 — Pain-Related Impairment (PRI)",
    text:
"PDQ-score -> WPI add-on:\n" +
"  None 0 -> 0% ; Mild 1-70 -> 1% ; Moderate 71-100 -> 2% ; Severe 101-150 -> 3%\n" +
"PRI 0-3% WPI bovenop de orgaansysteem-rating.\n" +
"NIET toevoegen als pijn al in de DBI-rating zit, of als jurisdictie het uitsluit."
  },

  ch14_dbi: {
    title: "Table 14-1 — Psychiatric Impairment DBI Grid",
    text: null,
    missing: "[TABEL 14-1 VERIFICATIE — psychiatrische DBI grid niet beschikbaar, handmatige beoordeling door arts vereist]",
    fallback:
"Beschrijvende methodiek (Chapter 14): DSM-diagnose + Mental Status Examination +\n" +
"functioneel oordeel over 4 domeinen: ADL, sociaal functioneren, concentratie/tempo,\n" +
"adaptatie/decompensatie. Classes 0-4 zoals andere hoofdstukken. Geen exacte WPI."
  },

  appendix_combined: {
    title: "Appendix — Combined Values",
    text:
"Bij meerdere impairments (elk als WPI): neem grootste A en kleinste B.\n" +
"  Combined = A + B × (1 - A/100), afronden op heel getal.\n" +
"  3+ impairments: combineer eerste twee, daarna resultaat met de volgende, enz.\n" +
"Voorbeeld: 15% en 10% -> 15 + 10×(1-0,15) = 23,5 -> 24% WPI.\n" +
"De combined value is altijd LAGER dan de simpele som."
  }
};

window.Kinetic.AMA_TABLES = AMA_TABLES;

/* ── Selectielogica: diagnose-trefwoorden -> relevante tabellen ──────────── */
var GROUPS = [
  { keys:["ch17_cervical","ch17_fh","ch17_pe","ch17_cs"], kw:["cervicaal","cervicale","whiplash","wad","nekklach","nekpijn","hnp cervic","cervicobrachialgie","c5-c6","c6-c7"] },
  { keys:["ch17_lumbar","ch17_fh","ch17_pe","ch17_cs"], kw:["lumbaal","lumbale","rughernia","spondylolisthesis","hnp l","l4-l5","l5-s1","lwk","lage rug"] },
  { keys:["ch15_shoulder","ch15_fh","ch15_pe","ch15_cs"], kw:["schouder","rotatorcuff","rotator cuff","ac-luxatie","ac luxatie","ac-gewricht","clavicula","supraspinatus","infraspinatus"] },
  { keys:["ch15_elbow","ch15_fh","ch15_pe","ch15_cs"], kw:["elleboog","olecranon","epicondyl"] },
  { keys:["ch15_wrist","ch15_fh","ch15_pe","ch15_cs"], kw:["pols","scaphoid","carpaal"] },
  { keys:["ch15_nerve"], kw:["ulnaris","medianus","radialis","sulcus ulnaris","perifere zenuw"] },
  { keys:["ch16_knee","ch16_fh","ch16_pe","ch16_cs"], kw:["knie","meniscus","kruisband","tibiaplateau","patella","vkb","akb"] },
  { keys:["ch16_ankle","ch16_fh","ch16_pe","ch16_cs"], kw:["enkel","voet","calcaneus","achilles","subtalair"] },
  { keys:["ch16_hip","ch16_fh","ch16_pe","ch16_cs"], kw:["heup","femur","bekken","acetabulum"] },
  { keys:["ch13_tbi","ch13_consciousness","ch13_emotional"], kw:["tbi","commotio","post commotioneel","postcommotioneel","pcs","hersenletsel"] },
  { keys:["ch14_dbi"], kw:["ptss","posttraumatisch stress","depressie","angststoornis","psychiatr"] },
  { keys:["ch03_pain"], kw:["chronische pijn","crps","pijnsyndroom","sudeck","fibromyalgie"] }
];

// Geeft de relevante tabel-keys terug (ch02_method altijd; appendix_combined bij meerdere groepen).
function selectAMATables(text){
  var t = (text || "").toLowerCase();
  var keys = ["ch02_method"];
  var matchedGroups = 0;
  GROUPS.forEach(function(g){
    var hit = g.kw.some(function(k){ return t.indexOf(k) >= 0; });
    if(hit){
      matchedGroups++;
      g.keys.forEach(function(k){ if(keys.indexOf(k) < 0) keys.push(k); });
    }
  });
  if(matchedGroups >= 2 && keys.indexOf("appendix_combined") < 0) keys.push("appendix_combined");
  return keys;
}

function tableText(key){
  var t = AMA_TABLES[key];
  if(!t) return "";
  var body = t.text ? t.text : (t.missing || "");
  if(!t.text && t.fallback) body += "\n" + t.fallback;
  return "\n## " + t.title + "\n" + body + "\n";
}

var AMA_INSTRUCTIONS =
"=== AMA GUIDES 6E EDITIE — VOORLOPIGE IMPAIRMENT RATING ===\n" +
"Op basis van de diagnosen in dit dossier, doe een voorlopige impairment rating.\n" +
"STAP 1: identificeer per diagnose de juiste Regional Grid tabel.\n" +
"STAP 2: bepaal de Class of Diagnosis (CDX) en default WPI.\n" +
"STAP 3: bepaal Grade Modifiers uit het dossier: GMFH (functional history / klachten, ADL), GMPE (lichamelijk onderzoek), GMCS (clinical studies / beeldvorming).\n" +
"STAP 4: Net Adjustment = (GMFH-CDX) + (GMPE-CDX) + (GMCS-CDX).\n" +
"STAP 5: bepaal Grade (A-E) binnen de class (-2=A, -1=B, 0=C, +1=D, +2=E). Class verandert NIET.\n" +
"STAP 6: bij meerdere diagnosen bereken de Combined Value.\n" +
"BELANGRIJK: dit is een AI-voorbereiding. Markeer onzekerheden met [VERIFICATIE ARTS]. " +
"Als een relevante tabel ontbreekt, neem de ONTBREEKT-markering letterlijk over in opmerkingen. " +
"De BIG-geregistreerde specialist verifieert en autoriseert.\n\n" +
"Voeg aan \"sections\" exact één extra sectie toe met deze structuur:\n" +
"{\"num\":\"AMA\",\"title\":\"Voorlopige Impairment Rating (AMA Guides 6e editie)\",\"badge\":\"ai\",\"type\":\"ama_rating\"," +
"\"ratings\":[{\"diagnose\":\"\",\"tabel\":\"\",\"cdx\":0,\"default_wpi\":0," +
"\"gmfh\":{\"waarde\":0,\"onderbouwing\":\"\"},\"gmpe\":{\"waarde\":0,\"onderbouwing\":\"\"},\"gmcs\":{\"waarde\":0,\"onderbouwing\":\"\"}," +
"\"net_adjustment\":\"\",\"grade\":\"\",\"wpi\":\"\",\"opmerkingen\":[\"\"]}]," +
"\"combined_value\":\"\"}\n" +
"Verhoog stats.aiSections met 1 voor deze sectie.";

// Volledig tekstblok om aan de invoer (dossier) toe te voegen bij EXPERTISE.
function amaPromptBlock(text){
  var keys = selectAMATables(text);
  var tablesTxt = keys.map(tableText).join("");
  return "\n\n" + AMA_INSTRUCTIONS + "\n\nRelevante AMA-tabellen voor dit dossier:\n" + tablesTxt;
}

window.Kinetic.selectAMATables = selectAMATables;
window.Kinetic.amaPromptBlock = amaPromptBlock;
})();
