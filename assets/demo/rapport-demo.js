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
    opdrachtgever: "[OPDRACHTGEVER]",
    ongevalsdatum: "29-01-2022",
    onderzoeksdatum: "23-04-2024",
    kicker: "Letselschade &middot; IWMD &middot; fictief voorbeeld",
    titel: "Medische expertise orthopedie",
    subtitel: "Letselschade · vraagstelling volgens IWMD",
    kern: [{"label": "Diagnose", "waarde": "Chronische nekklachten met uitstraling naar de linker arm na WAD graad II", "breed": true}, {"label": "Blijvende invaliditeit", "waarde": "5%", "toelichting": "van de gehele persoon", "groot": true}, {"label": "Causaal verband", "waarde": "Aanwezig", "toelichting": "Klachten direct na het ongeval, blanco voorgeschiedenis"}, {"label": "Eindtoestand", "waarde": "Bereikt", "toelichting": "Per 23-04-2024"}, {"label": "Pre-existent", "waarde": "Degeneratie C5–C6", "toelichting": "Zonder klachten voor het ongeval"}, {"label": "Dossier", "waarde": "9 van 12 stukken", "toelichting": "3 hiaten, 3 aandachtspunten"}, {"label": "Buiten vakgebied", "waarde": "Neurologie", "toelichting": "Ulnarisneuropathie en cognitieve klachten"}],
    ondertekening: {"arts": "[ARTS]", "specialist": "Orthopedisch chirurg, BIG-geregistreerd", "status": "Concept. Na controle door de specialist en inzage door betrokkene wordt het rapport definitief."}
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
      num:"1", deel:"Dossier", title:"Gegevens opdrachtgever en betrokkene", badge:"ai", type:"fields",
      fields: [
        {label:"Opdrachtgever", value:"[OPDRACHTGEVER]", redacted:true},
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
      intro:"Vraagstelling zoals aangeleverd door de opdrachtgever. Voorbeeld op basis van de IWMD-vraagstelling; de actuele versie (2025) geldt als uitgangspunt.",
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
      num:"6", deel:"Onderzoek en oordeel", title:"Huidige klachten (anamnese)", badge:"arts", type:"text",
      paragraphs: [
        "Betrokkene rapporteert bij onderzoek d.d. 23-04-2024:",
        "Nek: VAS 5\u20136/10, uitstraling linker schouder/arm. Verergering bij beeldschermwerk en autorijden.\nHoofdpijn: 3\u20134x/week, fronto-temporaal, 4\u20138 uur.\nCognitief: verminderde concentratie, multitasking bemoeilijkt.\nSlaap: moeite met inslapen, 1\u20132x/nacht wakker.\nArbeid: 40% arbeidsongeschikt, werkt 3 dagen/week bij [ORGANISATIE-4]."
      ],
      sources: ["Anamnese 23-04-2024","Brief neurologie 08-03-2023, p. 1\u20132"]
    },
    {
      num:"7", title:"Lichamelijk onderzoek", badge:"arts", type:"arts_template",
      prompt:"Bevindingen van de onderzoekend arts.",
      table: {"vergelijk": "Ten opzichte van de normaalwaarde", "kolommen": ["Gemeten", "Normaalwaarde"], "rijen": [["Flexie", "40°", "50°"], ["Extensie", "30°", "60°"], ["Rotatie links", "50°", "80°"], ["Rotatie rechts", "60°", "80°"], ["Lateroflexie links", "25°", "45°"], ["Lateroflexie rechts", "25°", "45°"]]},
      subfields: [
        {label:"Algemene indruk", tekst:"Verzorgde man die zich wat voorzichtig beweegt en tijdens het gesprek regelmatig van houding wisselt. Lengte 182 cm, gewicht 84 kg.", context:null},
        {label:"Cervicale wervelkolom", tekst:"Geen standsafwijking. Actieve beweeglijkheid: flexie 40°, extensie 30°, rotatie links 50° en rechts 60°, lateroflexie 25° beiderzijds. Eindstandige pijn bij extensie en rotatie naar links. Drukpijn paravertebraal C4–C6 links, verhoogde spierspanning van de m. trapezius links.", context:"Vergelijk: fysio 21-02-2022 (flex 35\u00b0, ext 25\u00b0), neuroloog 08-03-2023 (rot L 40\u00b0, R 55\u00b0, Spurling+). MRI: protrusie C5\u2013C6."},
        {label:"Neurologisch bovenste extremiteiten", tekst:"Kracht symmetrisch 5/5. Reflexen symmetrisch opwekbaar. Verminderd gevoel aan de radiale zijde van de linker onderarm (C6) en aan dig IV–V links. Voor de duiding van de ulnarisklachten verwijs ik naar de neuroloog.", context:"EMG: ulnaris neuropathie elleboog L (42 m/s, N>50). Hypoesthesie C6 L, sensibiliteitsverlies dig IV\u2013V."},
        {label:"Provocatietesten", tekst:"Spurling links positief met uitstraling naar de schouder, rechts negatief.", context:"Spurling positief L (neuroloog 08-03-2023)."},
        {label:"Aanvullend onderzoek", tekst:"De MRI van 18-08-2022 heb ik zelf bekeken: discusdegeneratie C5–C6 met protrusie en foraminastenose links, passend bij het verslag. Geen aanvullend onderzoek verricht.", context:null}
      ]
    },
    {
      num:"8", title:"Diagnose en beschouwing", badge:"arts", type:"arts_template",
      prompt:"Per onderdeel staan de relevante dossiergegevens erbij. Zie ook de tegenstrijdigheden in sectie 5b.",
      flow: [{"waarde": "Tabel 17-2", "label": "cervicale wervelkolom"}, {"waarde": "Klasse 1", "label": "na grade modifiers"}, {"waarde": "5%", "label": "gehele persoon"}],
      subfields: [
        {label:"Diagnose op vakgebied", tekst:"Chronische nekklachten met uitstraling naar de linker arm na een whiplashtrauma (WAD graad II), bij pre-existente degeneratie C5–C6. Differentiaal diagnostisch een radiculopathie C6 links. De ulnarisneuropathie en de cognitieve klachten vallen buiten mijn vakgebied.", context:"Neuroloog: (1) cervicobrachialgie C5\u2013C6, (2) ulnaris neuropathie, (3) PCS. Zie sectie 5b."},
        {label:"Causaal verband", tekst:"De nekklachten zijn direct na het ongeval ontstaan, bij een blanco voorgeschiedenis voor het bewegingsapparaat. De degeneratie C5–C6 bestond al, maar gaf geen klachten. Naar mijn oordeel heeft het ongeval de klachten uitgelokt; een causaal verband acht ik aanwezig.", context:"CT SEH: spondylose pre-existent. MRI: protrusie. Neuroloog: traumatisch geagraveerd. EMG: causaliteit open. \u2192 Zie tegenstrijdigheden 5b."},
        {label:"Pre-existente factoren", tekst:"Asymptomatische degeneratie C5–C6 en L4–L5. Zonder ongeval hadden op termijn ook nekklachten kunnen ontstaan; het moment en de omvang daarvan zijn niet met redelijke zekerheid vast te stellen.", context:"Spondylose C5\u2013C6 + L4\u2013L5 (CT/r\u00f6ntgen). Geen klachten in huisartsjournaal v\u00f3\u00f3r ongeval."},
        {label:"Prognose en eindtoestand", tekst:"Ruim twee jaar na het ongeval en na uitgebreide behandeling verwacht ik geen wezenlijke verbetering meer. Eindtoestand per 23-04-2024.", context:"Neuroloog: PCS-herstel 6\u201312 mnd. Bedrijfsarts: volledige werkhervatting niet voor sept 2023. Huidig (apr 2024): 40% AO."},
        {label:"Blijvende invaliditeit (AMA Guides 6e ed.)", tekst:"Cervicale wervelkolom volgens tabel 17-2, klasse 1, na correctie met de grade modifiers 5% van de gehele persoon. De ulnarisneuropathie en de cognitieve klachten beoordeelt de neuroloog.", context:"Relevante chapters: Ch.17 Spine (Table 17-2 Cervical DBI) voor cervicaal syndroom. Ch.15 Upper Extremities (Table 15-5 Clavicle/AC) voor AC-luxatie. Ch.13 CNS/PNS (Table 13-12 Peripheral Nerve) voor ulnaris neuropathie. Ch.13 (Table 13-6 TBI) voor PCS."}
      ]
    },
    {
      num:"9", title:"Beantwoording IWMD-vragen", badge:"arts", type:"iwmd_answers",
      intro:"De arts beantwoordt de vraagstelling. Per vraag staan de relevante bronnen uit het dossier.",
      questions: [
        {q:"Vraag 1 \u2014 Anamnese: aard, ernst, verloop letsel en behandelingen?", antwoord:"Zie sectie 6 (anamnese) en de samenvatting medische informatie in sectie 5.", context:"Zie secties 4 en 6 voor het dossieroverzicht."},
        {q:"Vraag 2 \u2014 Medische voorgeschiedenis op uw vakgebied?", antwoord:"Blanco voor het bewegingsapparaat. In 2019 spanningshoofdpijn bij de huisarts; geen nek- of schouderklachten (sectie 3).", context:"Zie sectie 3."},
        {q:"Vraag 3 \u2014 Bevindingen bij lichamelijk en hulponderzoek?", antwoord:"Zie sectie 7.", context:null},
        {q:"Vraag 4 \u2014 Diagnose en differentiaaldiagnostische overwegingen?", antwoord:"Chronische nekklachten met uitstraling naar de linker arm na WAD graad II, bij pre-existente degeneratie C5–C6. Differentiaal diagnostisch een radiculopathie C6 links.", context:null},
        {q:"Vraag 5 \u2014 Causaal verband klachten/stoornissen met ongeval?", antwoord:"Ja. De klachten ontstonden direct na het ongeval, bij een blanco voorgeschiedenis. Zie sectie 8.", context:"Aandacht: 3 tegenstrijdigheden (sectie 5b). Pre-existente spondylose vs. traumatische agravatie."},
        {q:"Vraag 6 \u2014 Eindtoestand? Zo ja, per welke datum?", antwoord:"Ja, per 23-04-2024.", context:"Neuroloog: PCS 6\u201312 mnd. 26 mnd post-trauma, klachten persisteren."},
        {q:"Vraag 7 \u2014 Beperkingen in huidige toestand (incl. FML)?", antwoord:"Geen langdurig statische belasting van de nek: beeldschermwerk en autorijden maximaal een uur aaneengesloten. Geen werk boven schouderhoogte en niet tillen boven 10 kg.", context:"Bedrijfsarts: max 4u/dag, beperkt bovenhands, pijn zitten >45 min. AMA Guides 6e ed.: Ch.17 Table 17-2 (cervicaal), Ch.15 Table 15-5 (AC-luxatie), Ch.13 Table 13-12 (ulnaris), Ch.13 Table 13-6 (PCS)."},
        {q:"Vraag 8 \u2014 Beperkingen toe te schrijven aan ongeval? Pre-existent?", antwoord:"Grotendeels aan het ongeval. Door de pre-existente degeneratie hadden op termijn ook zonder ongeval beperkingen kunnen ontstaan; de omvang daarvan is niet met redelijke zekerheid vast te stellen.", context:"Kritiek: zie tegenstrijdigheid 1 (sectie 5b). Spondylose pre-existent, geen klachten gedocumenteerd."},
        {q:"Vraag 9 \u2014 Therapeutische suggesties?", antwoord:"Voortzetten van het oefenprogramma en ergonomische aanpassing van de werkplek. Van verdere invasieve behandeling verwacht ik weinig.", context:null},
        {q:"Vraag 10 \u2014 Overige relevante feiten of omstandigheden?", antwoord:"Voor de ulnarisneuropathie en de cognitieve klachten adviseer ik een neurologische expertise, met neuropsychologisch onderzoek.", context:"3 hiaten (sectie 5a), 3 tegenstrijdigheden (sectie 5b)."}
      ]
    },
    {
      num:"10", deel:"Bijlage", title:"Bronnenlijst", badge:"ai", type:"bronnen",
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
  stats: {aiSections:7, artsSections:4, bronnen:10, hiaten:3, tegenstrijdigheden:3}
};

/* Tweede voorbeeld: medische expertise volgens de NVMSR-richtlijn (deel 1 met ongeval,
   deel 2 zonder ongeval, deel 3 overig). Fictieve casus, geen echte persoon. */
var EXAMPLE_NVMSR = {
  meta: {
    zaaknummer: "2025-KME-01317",
    betrokkene: "[PERSOON-1]",
    geboortedatum: "[GEBOORTEDATUM]",
    status: "Concept",
    specialisme: "Orthopedisch",
    kicker: "Medische expertise &middot; fictief voorbeeld",
    titel: "Medisch specialistische rapportage",
    subtitel: "Volgens de richtlijn Medisch Specialistische Rapportage (NVMSR) · Orthopedisch",
    onderzoeksdatum: "T+24m",
    kern: [{"label": "Diagnose", "waarde": "Pijnlijke bewegingsbeperking van de rechter pols na distale radiusfractuur", "breed": true}, {"label": "Blijvende invaliditeit", "waarde": "4%", "toelichting": "van de gehele persoon (7% bovenste extremiteit)", "groot": true}, {"label": "Medische eindsituatie", "waarde": "Bereikt", "toelichting": "Verdere verbetering niet verwacht"}, {"label": "Consistentie", "waarde": "Consistent", "toelichting": "Anamnese, dossier en onderzoek"}, {"label": "Knijpkracht rechts", "waarde": "70%", "toelichting": "van de niet-aangedane zijde"}, {"label": "Zonder ongeval", "waarde": "Geen klachten", "toelichting": "Geen invaliditeit"}, {"label": "Dossier", "waarde": "7 van 8 stukken", "toelichting": "1 hiaat"}],
    ondertekening: {"arts": "[ARTS]", "specialist": "Orthopedisch chirurg, BIG-geregistreerd", "status": "Concept. Na controle door de specialist en inzage door betrokkene wordt het rapport definitief."}
  },
  compleetheid: {
    score: 88,
    aanwezig: ["SEH-verslag","Operatieverslag","Ontslagbrief","Poliklinische brieven orthopedie","Röntgenverslagen","Fysiotherapie eindverslag","Huisartsjournaal"],
    ontbrekend: [
      {doc:"Verslag arbeidsdeskundige / bedrijfsarts", prio:"belangrijk"}
    ]
  },
  sections: [
    {
      num:"0", deel:"Dossier", title:"Gegevens opdrachtgever en betrokkene", badge:"ai", type:"fields",
      fields: [
        {label:"Opdrachtgever", value:"[OPDRACHTGEVER]", redacted:true},
        {label:"Betrokkene", value:"[PERSOON-1]", redacted:true},
        {label:"Geboortedatum", value:"[GEBOORTEDATUM]", redacted:true},
        {label:"Beroep", value:"Monteur installatietechniek"},
        {label:"Kader", value:"Civiele aansprakelijkheid, beoordeling van de ongevalsgevolgen"},
        {label:"Ongeval", value:"T±0: val van een trap tijdens werkzaamheden"},
        {label:"Datum onderzoek", value:"T+24m"}
      ]
    },
    {
      num:"0", title:"Opzet van de rapportage", badge:"ai", type:"text",
      paragraphs: [
        "De rapportage volgt de richtlijn Medisch Specialistische Rapportage. Deel 1 beschrijft de gezondheidstoestand en het functioneren in de situatie met ongeval, deel 2 de hypothetische situatie zonder ongeval en deel 3 overige vragen van de opdrachtgever."
      ]
    },
    {
      num:"0", title:"Medische voorgeschiedenis", badge:"ai", type:"text",
      paragraphs: [
        "Huisartsjournaal (T−5j tot T±0): geen klachten of behandelingen van de bovenste extremiteiten. Geen operaties in de voorgeschiedenis."
      ],
      sources: ["Huisartsjournaal, p. 1–2"]
    },
    {
      num:"0", title:"Samenvatting medische informatie", badge:"ai", type:"text",
      paragraphs: [
        "T±0 — SEH: distale radiusfractuur rechts, dorsaal gedisloceerd (SEH-verslag, p. 1)\nT+2d — Operatie: open repositie en plaatfixatie (operatieverslag, p. 1)\nT+6w — Polikliniek orthopedie: consolidatie op röntgenfoto, start fysiotherapie (brief, p. 2)\nT+6m — Fysiotherapie eindverslag: restbeperking pols, knijpkracht verminderd (eindverslag, p. 3)\nT+14m — Polikliniek orthopedie: verwijdering osteosynthesemateriaal (brief, p. 1)"
      ],
      sources: ["SEH-verslag, p. 1","Operatieverslag, p. 1","Poliklinische brieven orthopedie, p. 1–2","Fysiotherapie eindverslag, p. 3"]
    },
    {
      num:"0", title:"Hiaten in het dossier", badge:"ai", type:"hiaten",
      hiaten: [
        {prio:"belangrijk", doc:"Verslag arbeidsdeskundige / bedrijfsarts", verwacht:"T+3m tot T+12m", toelichting:"Werkhervatting wordt genoemd in de poliklinische brief, maar er is geen verslag over belastbaarheid in het werk.", actie:"Opvragen bij de werkgever of arbodienst."}
      ]
    },
    {
      num:"1a", deel:"Deel 1 · Situatie met ongeval", title:"Anamnese", badge:"arts", type:"arts_template",
      prompt:"Het gesprek met betrokkene.",
      subfields: [
        {label:"Toedracht en beloop", tekst:"Op T±0 viel betrokkene tijdens werkzaamheden van een trap en ving zich op met de rechterhand. Op de SEH bleek de pols gebroken; twee dagen later volgde een operatie met een plaat. Na zes weken gips startte fysiotherapie, die tot een half jaar na het ongeval duurde. Na veertien maanden is de plaat verwijderd.", context:"Zie samenvatting medische informatie: fractuur, operatie T+2d, fysiotherapie tot T+6m, materiaalverwijdering T+14m."},
        {label:"Huidige klachten en beperkingen in werk en vrije tijd", tekst:"Pijn aan de rechter pols bij draaien en steunen, bijvoorbeeld bij het aandraaien van koppelingen en bij opstaan uit een stoel. Langdurig gereedschap vasthouden lukt minder lang. Hij werkt weer volledig als monteur, maar laat zwaar trekwerk aan collega's over. Zijn fitnesstraining heeft hij aangepast. Geen pijnstillers.", context:null}
      ]
    },
    {
      num:"1b", title:"Medische gegevens", badge:"arts", type:"arts_template",
      prompt:"Op basis van anamnese en dossier.",
      subfields: [
        {label:"Voorgeschiedenis, medicatie, allergieën", tekst:"Geen klachten of behandelingen van de bovenste extremiteiten. Geen medicatie, geen allergieën. Rechtshandig.", context:"Huisartsjournaal: geen klachten bovenste extremiteiten voor het ongeval."}
      ]
    },
    {
      num:"1c", title:"Lichamelijk onderzoek", badge:"arts", type:"arts_template",
      prompt:"Bevindingen van de onderzoekend arts.",
      subfields: [
        {label:"Algemeen en inspectie", tekst:"Lengte 181 cm, gewicht 83 kg. Normaal looppatroon. Rustig litteken van 8 cm aan de handpalmzijde van de rechter pols. Geen zwelling of standsafwijking.", context:null},
        {label:"Palpatie en functie", tekst:"Drukpijn over het distale radio-ulnaire gewricht rechts, geen drukpijn in de tabatière. Pro- en supinatie eindstandig pijnlijk. Fijne motoriek normaal.", context:"Fysiotherapie eindverslag T+6m: extensie pols rechts 45°, knijpkracht 70% van links (p. 3)."}
      ],
      table: {
        vergelijk: "Rechts ten opzichte van links",
        kolommen: ["Rechts (aangedane zijde)","Links"],
        rijen: [["Omtrek pols","17,5 cm","17,0 cm"],["Omtrek onderarm (10 cm distaal elleboog)","27,0 cm","28,0 cm"],["Pols extensie-flexie","45-0-55","70-0-80"],["Pols radiaal-ulnairdeviatie","15-0-25","20-0-35"],["Onderarm pronatie-supinatie","80-0-70","85-0-85"],["Knijpkracht (kg)","32","46"]]
      }
    },
    {
      num:"1d", title:"Consistentie", badge:"arts", type:"arts_template",
      prompt:"Samenhang tussen anamnese, dossier en eigen bevindingen.",
      subfields: [{label:"Oordeel over de consistentie", tekst:"De klachten van betrokkene, het beloop in het medisch dossier en mijn bevindingen bij onderzoek zijn onderling consistent.", context:null}]
    },
    {
      num:"1f", title:"Diagnose", badge:"arts", type:"arts_template",
      prompt:"Diagnose op het eigen vakgebied.",
      subfields: [{label:"Diagnose", tekst:"Pijnlijke bewegingsbeperking van de rechter pols bij status na distale radiusfractuur rechts, behandeld met plaatfixatie en materiaalverwijdering.", context:"Status na distale radiusfractuur rechts, plaatfixatie en materiaalverwijdering."}]
    },
    {
      num:"1g", title:"Beperkingen", badge:"arts", type:"arts_template",
      prompt:"Beperkingen in werk, huishouden en vrije tijd.",
      subfields: [{label:"Beperkingen", tekst:"Verminderde knijpkracht en belastbaarheid van de rechter pols. Beperkt in krachtig draaien, steunen op de hand en langdurig vasthouden van gereedschap. Geen beperkingen in de fijne motoriek.", context:null}]
    },
    {
      num:"1h", title:"Blijvende invaliditeit", badge:"arts", type:"arts_template",
      flow: [{"waarde": "7%", "label": "bovenste extremiteit"}, {"waarde": "× 0,6", "label": "omrekening"}, {"waarde": "4%", "label": "gehele persoon"}],
      prompt:"Volgens de AMA Guides 6e editie en de leidraad van de Werkgroep Invaliditeit en Arbeidsongeschiktheid van de NOV.",
      subfields: [{label:"Berekening per diagnose en totaal", tekst:"De bewegingsbeperking van de pols (tabel 15-32) geeft 7% van de bovenste extremiteit. Die waarde is hoger dan de diagnosegebonden waarde en wordt daarom gebruikt. Blijvende invaliditeit: 7% van de bovenste extremiteit, 4% van de gehele persoon.", context:null}]
    },
    {
      num:"1i", title:"Medische eindsituatie", badge:"arts", type:"arts_template",
      prompt:"Is er sprake van een medische eindsituatie, en zo nee, wanneer wordt die verwacht?",
      subfields: [{label:"Medische eindsituatie", tekst:"Er is sprake van een medische eindsituatie. Verdere verbetering verwacht ik niet.", context:"Laatste poliklinisch contact T+14m (materiaalverwijdering)."}]
    },
    {
      num:"–", title:"Inzage en blokkeringsrecht", badge:"arts", type:"arts_template",
      prompt:"Vastleggen of betrokkene het concept wil inzien en of gebruik wordt gemaakt van het blokkeringsrecht.",
      subfields: [{label:"Keuze van betrokkene", tekst:"Betrokkene wil het concept inzien. Op het blokkeringsrecht gewezen; hij maakt daar geen gebruik van.", context:null}]
    },
    {
      num:"2", deel:"Deel 2 · Situatie zonder ongeval", title:"Situatie zonder ongeval", badge:"arts", type:"arts_template",
      prompt:"Klachten, afwijkingen en beperkingen in de hypothetische situatie zonder ongeval.",
      subfields: [
        {label:"Klachten en beperkingen voor het ongeval", tekst:"Geen klachten aan de rechter pols of hand.", context:"Huisartsjournaal: geen klachten bovenste extremiteiten."},
        {label:"Klachten die ook zonder ongeval waren ontstaan", tekst:"Nee, op mijn vakgebied zijn er geen klachten die ook zonder ongeval waren ontstaan.", context:null},
        {label:"Blijvende invaliditeit zonder ongeval", tekst:"Nee.", context:null}
      ]
    },
    {
      num:"3", deel:"Deel 3 · Overig", title:"Overige vragen", badge:"arts", type:"arts_template",
      prompt:"Aanvullende vragen van de opdrachtgever.",
      subfields: [{label:"Overig", tekst:"Geen aanvullende vragen.", context:null}]
    },
    {
      num:"–", deel:"Bijlage", title:"Bronnenlijst", badge:"ai", type:"bronnen",
      bronnen: [
        {nr:"1", doc:"SEH-verslag", bron:"[ORGANISATIE-1]", datum:"T±0", paginas:"1"},
        {nr:"2", doc:"Operatieverslag", bron:"[ORGANISATIE-1]", datum:"T+2d", paginas:"1"},
        {nr:"3", doc:"Poliklinische brieven orthopedie", bron:"[ORGANISATIE-1]", datum:"T+6w–T+14m", paginas:"1–2"},
        {nr:"4", doc:"Fysiotherapie eindverslag", bron:"[ORGANISATIE-2]", datum:"T+6m", paginas:"3"},
        {nr:"5", doc:"Huisartsjournaal", bron:"[ORGANISATIE-3]", datum:"T−5j–T+24m", paginas:"1–2"}
      ]
    }
  ],
  stats: {aiSections:6, artsSections:10, bronnen:5, hiaten:1, tegenstrijdigheden:0}
};


function prioColor(p){return p==="kritiek"?"#D94F4F":p==="belangrijk"?"#C77B2E":"var(--warm-teal)";}
function prioLabel(p){return p==="kritiek"?"Kritiek":p==="belangrijk"?"Belangrijk":"Aandacht";}
function sevColor(s){return s==="kritiek"?"#D94F4F":s==="belangrijk"?"#C77B2E":"var(--warm-teal)";}
function sevLabel(s){return s==="kritiek"?"Kritiek":s==="belangrijk"?"Belangrijk":"Aandacht";}

/* ---------- Visualisaties ---------- */
function tDays(str,base){
  str=String(str).trim();
  var m=str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if(m){var d=Date.UTC(+m[3],+m[2]-1,+m[1])/864e5;return base==null?d:d-base;}
  if(/^T\s*±\s*0$/.test(str))return 0;
  m=str.match(/^T\s*([+−-])\s*(\d+)\s*([dwmj])/);
  if(m){var f={d:1,w:7,m:30.44,j:365.25}[m[3]];return (m[1]==="+"?1:-1)*(+m[2])*f;}
  return null;
}
function fmtSpan(days){
  if(days<60)return Math.round(days)+" dagen";
  if(days<730)return Math.round(days/30.44)+" maanden";
  return (Math.round(days/365.25*10)/10).toString().replace(".",",")+" jaar";
}
function timelineAxis(lines){
  var ev=[],base=null;
  lines.forEach(function(line){
    var p=line.split(" — "),d=p.shift()||"",txt=p.join(" — ");
    var abs=/^\d{2}-\d{2}-\d{4}$/.test(d);
    if(abs&&base==null)base=tDays(d);
    var t=abs?tDays(d,base):tDays(d);
    if(t==null)return;
    var lab=txt.split(/[.:]/)[0].replace(/\[[A-Z0-9-]+\]/g,"").replace(/\s+/g," ").trim();
    ev.push({t:t,d:d,lab:lab});
  });
  if(ev.length<2)return "";
  var max=Math.max.apply(null,ev.map(function(e){return e.t;}))||1;
  var h='<figure class="kr-axis" aria-label="Verloop in de tijd"><div class="kr-axis-track">';
  ev.forEach(function(e,i){
    var x=Math.max(0,Math.min(100,e.t/max*100));
    h+='<div class="kr-axis-ev kr-lvl-'+(i%3)+(x>62?' kr-axis-right':'')+'" style="left:'+x.toFixed(2)+'%"><span class="kr-axis-dot"></span><span class="kr-axis-lab"><b>'+esc(e.d)+'</b>'+esc(e.lab)+'</span></div>';
  });
  h+='</div><figcaption><span>Ongeval</span><span>'+fmtSpan(max)+' later</span></figcaption></figure>';
  return h;
}
function numVal(v){
  if(v==null)return null;v=String(v);
  if(/cm/.test(v))return null;
  var m=v.match(/^\s*(\d+)\s*-\s*0\s*-\s*(\d+)\s*$/);if(m)return +m[1]+ +m[2];
  m=v.match(/^\s*(\d+(?:[.,]\d+)?)\s*°?\s*$/);if(m)return parseFloat(m[1].replace(",","."));
  return null;
}
function compareBars(tbl){
  var rows=[];
  tbl.rijen.forEach(function(r){
    if(!Array.isArray(r))return;
    var a=numVal(r[1]),b=numVal(r[2]);
    if(a==null||!b)return;
    rows.push({lab:r[0],pct:Math.round(a/b*100),a:r[1],b:r[2]});
  });
  if(!rows.length)return "";
  var h='<figure class="kr-bars"><figcaption>'+esc(tbl.vergelijk||"Ten opzichte van de andere zijde")+'</figcaption>';
  rows.forEach(function(r){
    h+='<div class="kr-bar"><span class="kr-bar-lab">'+esc(r.lab)+'</span><span class="kr-bar-track"><span class="kr-bar-fill" style="width:'+Math.min(r.pct,100)+'%"></span><span class="kr-bar-ref"></span></span><span class="kr-bar-pct">'+r.pct+'%</span></div>';
  });
  h+='</figure>';
  return h;
}
function ring(pct){
  var r=58,c=2*Math.PI*r,l=Math.max(0,Math.min(100,pct))/100*c;
  return '<svg class="kr-ring" viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="'+r+'" class="kr-ring-track"/><circle cx="70" cy="70" r="'+r+'" class="kr-ring-val" stroke-dasharray="'+l.toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 70 70)"/></svg>';
}
function flow(steps){
  var h='<div class="kr-flow">';
  steps.forEach(function(s,i){
    if(i)h+='<span class="kr-flow-arrow" aria-hidden="true">→</span>';
    h+='<div class="kr-flow-step'+(i===steps.length-1?' kr-flow-end':'')+'"><span class="kr-flow-val">'+esc(s.waarde)+'</span><span class="kr-flow-lab">'+esc(s.label)+'</span></div>';
  });
  return h+'</div>';
}

function redact(t){
  return esc(t).replace(/\[([A-Z]+(?:-[0-9]+)?)\]/g,'<span class="kr-redact" title="Gepseudonimiseerd">$1</span>');
}
function slug(t,i){return "kr-s"+i+"-"+String(t).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
function secNum(n){return (n&&n!=="0"&&n!=="–")?n:"";}

function renderRapport(data,target){
var o=target||document.getElementById("output");
var m=data.meta||{};
var h='';

/* ---------- Omslag ---------- */
h+='<article class="kr">';
h+='<header class="kr-cover">';
h+='<div class="kr-cover-top"><span class="kr-mark">Kinetic<i>.</i></span><span class="kr-cover-conf">Vertrouwelijk &middot; '+esc(m.status||"Concept")+'</span></div>';
h+='<div class="kr-cover-kicker">'+(m.kicker||"Letselschade &middot; IWMD")+'</div>';
h+='<h2 class="kr-cover-title">'+esc(m.titel||"Medische expertise")+'</h2>';
h+='<p class="kr-cover-sub">'+esc(m.subtitel||("Vraagstelling volgens IWMD · "+(m.specialisme||"")))+'</p>';
h+='<dl class="kr-cover-meta">';
h+='<div><dt>Zaaknummer</dt><dd>'+esc(m.zaaknummer||"")+'</dd></div>';
h+='<div><dt>Betrokkene</dt><dd>'+redact(m.betrokkene||"")+'</dd></div>';
h+='<div><dt>Specialisme</dt><dd>'+esc(m.specialisme||"")+'</dd></div>';
h+='<div><dt>Onderzoek</dt><dd>'+esc(m.onderzoeksdatum||"")+'</dd></div>';
h+='</dl>';
h+='</header>';

/* ---------- Kernbevindingen ---------- */
if(m.kern&&m.kern.length){
h+='<section class="kr-kern" aria-label="Kernbevindingen">';
h+='<div class="kr-kern-head"><span class="kr-eyebrow">Kernbevindingen</span><span class="kr-kern-note">De conclusies van de arts, vooraf samengevat</span></div>';
var big=m.kern.filter(function(k){return k.groot;})[0], wide=m.kern.filter(function(k){return k.breed;})[0];
h+='<div class="kr-hero">';
if(wide)h+='<div class="kr-hero-diag"><span class="kr-kern-label">'+esc(wide.label)+'</span><p>'+esc(wide.waarde)+'</p></div>';
if(big)h+='<div class="kr-hero-fig"><span class="kr-kern-label">'+esc(big.label)+'</span><span class="kr-hero-big">'+esc(big.waarde)+'</span><span class="kr-kern-sub">'+esc(big.toelichting||"")+'</span></div>';
h+='</div>';
h+='<div class="kr-kern-grid">';
m.kern.filter(function(k){return !k.groot&&!k.breed;}).forEach(function(k){
  h+='<div class="kr-kern-item'+(k.groot?' kr-kern-big':'')+(k.breed?' kr-kern-wide':'')+'"><span class="kr-kern-label">'+esc(k.label)+'</span><span class="kr-kern-value">'+esc(k.waarde)+'</span>'+(k.toelichting?'<span class="kr-kern-sub">'+esc(k.toelichting)+'</span>':'')+'</div>';
});
h+='</div></section>';
}

/* ---------- Inhoud + document ---------- */
var parts=[];data.sections.forEach(function(s,i){if(s.deel)parts.push({titel:s.deel,id:slug(s.deel,i)});});
h+='<div class="kr-layout">';
h+='<nav class="kr-toc" aria-label="Inhoud"><span class="kr-eyebrow">Inhoud</span><ol>';
data.sections.forEach(function(s,i){
  if(s.deel)h+='<li class="kr-toc-part">'+esc(s.deel)+'</li>';
  h+='<li><a href="#'+slug(s.title,i)+'"><span>'+esc(secNum(s.num))+'</span>'+esc(s.title)+'</a></li>';
});
h+='<li class="kr-toc-part">Afsluiting</li><li><a href="#kr-ondertekening"><span></span>Ondertekening</a></li>';
h+='</ol>';
h+='<div class="kr-legend"><span><i class="kr-dot kr-dot-do"></i>Dossierordening</span><span><i class="kr-dot kr-dot-arts"></i>Arts</span></div>';
h+='</nav>';

h+='<div class="kr-doc">';

/* Dossiercompleetheid, compact */
if(data.compleetheid){
var c=data.compleetheid, tot=c.aanwezig.length+c.ontbrekend.length;
h+='<div class="kr-compl"><div class="kr-compl-head"><span class="kr-eyebrow">Aangeleverde stukken</span><span class="kr-compl-score">'+c.aanwezig.length+' van '+tot+' stukken aanwezig</span></div>';
h+='<div class="kr-compl-bar"><span style="width:'+Math.round(c.aanwezig.length/tot*100)+'%"></span></div>';
h+='<ul class="kr-tiles">';
c.aanwezig.forEach(function(d){h+='<li><span class="kr-tile-ic"></span>'+esc(typeof d==="string"?d:d.doc)+'</li>';});
c.ontbrekend.forEach(function(d){h+='<li class="kr-miss"><span class="kr-tile-ic"></span>'+esc(typeof d==="string"?d:d.doc)+'<em>Ontbreekt</em></li>';});
h+='</ul>';
var nDo=data.sections.filter(function(x){return x.badge!=="arts";}).length, nAr=data.sections.length-nDo;
h+='<div class="kr-share"><div class="kr-share-bar"><span class="kr-share-do" style="flex:'+nDo+'"></span><span class="kr-share-ar" style="flex:'+nAr+'"></span></div><div class="kr-share-leg"><span><i class="kr-dot kr-dot-do"></i>Dossierordening &middot; '+nDo+' onderdelen</span><span><i class="kr-dot kr-dot-arts"></i>Arts &middot; '+nAr+' onderdelen</span></div></div>';
h+='</div>';
}

data.sections.forEach(function(s,i){
if(s.deel)h+='<div class="kr-part"><span>'+esc(s.deel)+'</span></div>';
var arts=s.badge==="arts";
h+='<section class="kr-sec'+(arts?' kr-sec-arts':'')+'" id="'+slug(s.title,i)+'">';
h+='<div class="kr-sec-head"><span class="kr-sec-num">'+esc(secNum(s.num))+'</span><h3>'+esc(s.title)+'</h3><span class="kr-sec-by">'+(arts?'Arts':'Dossierordening')+'</span></div>';

if(s.type==="fields"){
h+='<dl class="kr-fields">';
s.fields.forEach(function(f){h+='<div><dt>'+esc(f.label)+'</dt><dd>'+redact(f.value)+'</dd></div>';});
h+='</dl>';
}

if(s.type==="iwmd"){
if(s.intro)h+='<p class="kr-intro">'+esc(s.intro)+'</p>';
h+='<ol class="kr-questions">';
s.questions.forEach(function(q,qi){h+='<li><span>'+(qi+1)+'</span><p>'+esc(q)+'</p></li>';});
h+='</ol>';
}

if(s.type==="text"){
s.paragraphs.forEach(function(p){
  if(s.title==="Samenvatting medische informatie"&&p.indexOf("\n")!==-1){
    h+=timelineAxis(p.split("\n"));
    h+='<ol class="kr-timeline">';
    p.split("\n").forEach(function(line){
      var parts2=line.split(" — ");var d=parts2.shift()||"";
      h+='<li><time>'+esc(d)+'</time><p>'+redact(parts2.join(" — "))+'</p></li>';
    });
    h+='</ol>';
  }else{
    h+='<p class="kr-p">'+redact(p).replace(/\n/g,'<br>')+'</p>';
  }
});
if(s.sources&&s.sources.length){
  h+='<div class="kr-cite"><span class="kr-cite-label">Bron</span>';
  s.sources.forEach(function(src){h+='<span class="kr-cite-item">'+redact(src)+'</span>';});
  h+='</div>';
}
}

if(s.type==="hiaten"){
s.hiaten.forEach(function(hi){
  h+='<div class="kr-gap"><div class="kr-gap-head"><strong>'+redact(hi.doc)+'</strong><span class="kr-gap-prio kr-prio-'+esc(hi.prio||"aandacht")+'">'+prioLabel(hi.prio||"aandacht")+'</span></div>';
  h+='<p>'+redact(hi.toelichting)+'</p>';
  h+='<p class="kr-gap-meta"><span>Verwacht</span> '+redact(hi.verwacht)+' &nbsp;&middot;&nbsp; <span>Actie</span> '+redact(hi.actie)+'</p></div>';
});
}

if(s.type==="tegenstrijdigheden"){
s.items.forEach(function(it){
  h+='<div class="kr-contra"><div class="kr-gap-head"><strong>'+redact(it.thema)+'</strong><span class="kr-gap-prio kr-prio-'+esc(it.severity||"aandacht")+'">'+sevLabel(it.severity||"aandacht")+'</span></div>';
  h+='<ul>';it.bronnen.forEach(function(b){h+='<li>'+redact(b)+'</li>';});h+='</ul>';
  h+='<p class="kr-gap-meta"><span>Voor de arts</span> '+redact(it.relevantie)+'</p></div>';
});
}

if(s.type==="arts_template"){
if(s.prompt)h+='<p class="kr-intro">'+esc(s.prompt)+'</p>';
s.subfields.forEach(function(sf){
  var label=typeof sf==="string"?sf:sf.label, ctx=typeof sf==="string"?null:sf.context, tx=typeof sf==="string"?null:sf.tekst;
  h+='<div class="kr-finding"><h4>'+esc(label)+'</h4>';
  h+=tx?'<p class="kr-p">'+redact(tx)+'</p>':'<p class="kr-empty">In te vullen door de arts</p>';
  if(ctx)h+='<p class="kr-note"><span>Uit het dossier</span>'+redact(ctx)+'</p>';
  h+='</div>';
});
if(s.table){
  h+='<div class="kr-table-wrap"><table class="kr-table"><thead><tr><th>Meting</th>';
  s.table.kolommen.forEach(function(k,ki){h+='<th'+(ki===0?' class="kr-affected"':'')+'>'+esc(k)+'</th>';});
  h+='</tr></thead><tbody>';
  s.table.rijen.forEach(function(r){var row=Array.isArray(r)?r:[r];h+='<tr><th scope="row">'+esc(row[0])+'</th>';s.table.kolommen.forEach(function(k,ki){h+='<td'+(ki===0?' class="kr-affected"':'')+'>'+(row[ki+1]!=null?esc(row[ki+1]):'&middot;&middot;&middot;')+'</td>';});h+='</tr>';});
  h+='</tbody></table></div>';
  h+=compareBars(s.table);
}
if(s.flow)h+=flow(s.flow);
}

if(s.type==="iwmd_answers"){
if(s.intro)h+='<p class="kr-intro">'+esc(s.intro)+'</p>';
h+='<ol class="kr-answers">';
s.questions.forEach(function(it,qi){
  var q=typeof it==="string"?it:it.q, ctx=typeof it==="string"?null:it.context;
  h+='<li><span class="kr-answers-num">'+(qi+1)+'</span><div><p class="kr-answers-q">'+esc(q.replace(/^Vraag \d+ — /,""))+'</p>';
  h+=it.antwoord?'<p class="kr-p">'+redact(it.antwoord)+'</p>':'<p class="kr-empty">In te vullen door de arts</p>';
  if(ctx)h+='<p class="kr-note"><span>Uit het dossier</span>'+redact(ctx)+'</p>';
  h+='</div></li>';
});
h+='</ol>';
}

if(s.type==="bronnen"){
h+='<div class="kr-table-wrap"><table class="kr-table kr-bronnen"><thead><tr><th>Nr.</th><th>Document</th><th>Bron</th><th>Datum</th><th>Pag.</th></tr></thead><tbody>';
s.bronnen.forEach(function(b){h+='<tr><td>'+esc(b.nr)+'</td><th scope="row">'+redact(b.doc)+'</th><td>'+redact(b.bron)+'</td><td>'+esc(b.datum)+'</td><td>'+esc(b.paginas)+'</td></tr>';});
h+='</tbody></table></div>';
}

h+='</section>';
});

/* Ondertekening */
var ot=m.ondertekening||{};
h+='<section class="kr-sign" id="kr-ondertekening">';
h+='<div class="kr-sec-head"><span class="kr-sec-num"></span><h3>Ondertekening</h3><span class="kr-sec-by">Arts &middot; specialist</span></div>';
h+='<div class="kr-sign-grid">';
h+='<div><span class="kr-sign-role">Onderzoekend arts</span><span class="kr-sign-line"></span><span class="kr-sign-name">'+redact(ot.arts||"[ARTS]")+'</span></div>';
h+='<div><span class="kr-sign-role">Gecontroleerd en ondertekend</span><span class="kr-sign-line"></span><span class="kr-sign-name">'+esc(ot.specialist||"Medisch specialist, BIG-geregistreerd")+'</span></div>';
h+='</div>';
h+='<p class="kr-sign-status">'+esc(ot.status||"Concept. Nog niet ondertekend.")+'</p>';
h+='</section>';

h+='<footer class="kr-foot"><span>Kinetic<i>.</i> Medische Expertises</span><span>Ingekort, fictief voorbeeld &middot; '+data.stats.bronnen+' bronnen &middot; '+data.stats.hiaten+(data.stats.hiaten===1?' hiaat':' hiaten')+'</span></footer>';
h+='</div></div></article>';

o.innerHTML=h;
o.querySelectorAll('.kr-toc a').forEach(function(a){
  a.addEventListener('click',function(e){
    var t=o.querySelector(a.getAttribute('href'));if(!t)return;
    e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});
  });
});
}


var currentMode="example";
function setMode(mode){
currentMode=mode;
document.getElementById("modeExample").classList.toggle("active",mode==="example");
document.getElementById("modeCustom").classList.toggle("active",mode==="custom");
document.getElementById("inputPanel").classList.toggle("hidden",mode==="example");
if(mode==="example"){renderRapport(EXAMPLE_RAPPORT);}
else{document.getElementById("output").innerHTML='<div style="text-align:center;padding:3rem;color:var(--stone)"><p>Plak hierboven een gepseudonimiseerd medisch dossier en kies <strong>Maak conceptstructuur</strong>.</p></div>';}
}

async function generateRapportData(text,systemPrompt){
var content=await window.Kinetic.generate("rapport",text,systemPrompt||"Je bent een medisch dossier-analist voor letselschade-expertises. Genereer een concept IWMD expertiserapport.\n\nREGELS:\n- Gebruik EXACT de officiele IWMD-vraagstelling (10 vragen, letterlijke tekst)\n- AI-secties: gegevens, vraagstelling, voorgeschiedenis, toedracht, samenvatting, klachten, bronnenlijst\n- Arts-secties: lichamelijk onderzoek, diagnose/beschouwing, beantwoording IWMD-vragen\n- Hiaten: prioriteit per item (kritiek/belangrijk/wenselijk). Kritiek = nodig voor expertise. Belangrijk = versterkt rapport. Wenselijk = nice to have.\n- Tegenstrijdigheden: severity per item (kritiek/belangrijk/aandacht). Signaleer ALTIJD pre-existent vs traumatisch discussies.\n- Arts-templates: compact dossiercontext per subveld (max 2 regels feiten + bronverwijzing). Geen lange verhalen.\n- IWMD-vragen: gebruik de officiele IWMD-tekst. Voeg per vraag compacte dossiercontext toe (max 1-2 regels).\n- Dossiercompleetheid: bereken score, lijst aanwezige docs (strings), ontbrekende docs met prio (objects: {doc,prio}).\n- Bronnenlijst als laatste sectie.\n- Gebruik [PERSOON-N] en [ORGANISATIE-N] placeholders.\n\nKRITIEK: ALLEEN valide JSON. Geen markdown. Dubbele aanhalingstekens. Geen trailing commas.\n\nOfficiele IWMD-vragen (gebruik LETTERLIJK):\n1. Hoe luidt de anamnese voor wat betreft de aard en de ernst van het letsel, het verloop van de klachten, de toegepaste behandelingen en het resultaat van deze behandelingen?\n2. Wilt u op basis van het medisch dossier een beschrijving geven van de medische voorgeschiedenis op uw vakgebied?\n3. Wilt u een beschrijving geven van uw bevindingen bij lichamelijk en eventueel hulponderzoek?\n4. Wat is de diagnose op uw vakgebied? Wilt u daarbij differentiaal diagnostische overwegingen geven?\n5. Bestaat er een causaal verband met het ongeval?\n6. Is de huidige toestand als eindtoestand te beschouwen?\n7. Welke beperkingen bestaan bij betrokkene in zijn huidige toestand?\n8. Zijn beperkingen toe te schrijven aan het ongeval? Pre-existent?\n9. Heeft u therapeutische suggesties?\n10. Overige relevante feiten of omstandigheden?\n\nAMA GUIDES 6e EDITIE - DIAGNOSE-CHAPTER MAPPING:\nVoeg bij invaliditeits-velden de relevante AMA chapter/tabel referenties toe:\n- Cervicaal/lumbaal: Ch.17 Spine, Table 17-2 (Cervical) of 17-4 (Lumbar)\n- Schouder/AC-luxatie: Ch.15 Upper Ext, Table 15-5\n- Knie: Ch.16 Lower Ext, Table 16-3\n- Perifere zenuw: Ch.13, Table 13-12\n- Hersenletsel/PCS: Ch.13, Table 13-6 + 13-8\n- PTSS: Ch.14 Mental Disorders\n- Pijn: Ch.3 Pain\n\nJSON structuur:\n{\"meta\":{\"zaaknummer\":\"\",\"betrokkene\":\"\",\"geboortedatum\":\"\",\"status\":\"Concept\",\"specialisme\":\"\",\"opdrachtgever\":\"\",\"ongevalsdatum\":\"\",\"onderzoeksdatum\":\"\"},\"compleetheid\":{\"score\":0,\"aanwezig\":[\"string\"],\"ontbrekend\":[{\"doc\":\"string\",\"prio\":\"kritiek|belangrijk|wenselijk\"}]},\"sections\":[{\"num\":\"1\",\"title\":\"\",\"badge\":\"ai|arts\",\"type\":\"fields|text|iwmd|hiaten|tegenstrijdigheden|arts_template|iwmd_answers|bronnen\",\"fields\":[{\"label\":\"\",\"value\":\"\",\"redacted\":false}],\"paragraphs\":[\"\"],\"sources\":[\"\"],\"hiaten\":[{\"status\":\"ontbrekend\",\"prio\":\"kritiek|belangrijk|wenselijk\",\"doc\":\"\",\"verwacht\":\"\",\"toelichting\":\"\",\"actie\":\"\"}],\"items\":[{\"thema\":\"\",\"severity\":\"kritiek|belangrijk|aandacht\",\"bronnen\":[\"\"],\"relevantie\":\"\"}],\"prompt\":\"\",\"subfields\":[{\"label\":\"\",\"context\":\"\"}],\"intro\":\"\",\"questions\":[{\"q\":\"\",\"context\":\"\"}],\"bronnen\":[{\"nr\":\"\",\"doc\":\"\",\"bron\":\"\",\"datum\":\"\",\"paginas\":\"\"}]}],\"stats\":{\"aiSections\":0,\"artsSections\":0,\"bronnen\":0,\"hiaten\":0,\"tegenstrijdigheden\":0}}\n\nDossier:\n\n");
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
return parsed;
}

async function generateRapport(){
var text=document.getElementById("customInput").value.trim();
if(!text)return;
var btn=document.getElementById("extractBtn");
btn.disabled=true;
btn.innerHTML='<span class="spinner"></span>Verwerken…';
document.getElementById("output").innerHTML='<div style="text-align:center;padding:3rem;color:var(--stone)"><div class="spinner" style="border-color:rgba(47,111,106,.2);border-top-color:var(--warm-teal);width:24px;height:24px;margin:0 auto"></div><p style="margin-top:1rem">Conceptstructuur wordt opgebouwd…</p></div>';
try{
var parsed=await generateRapportData(text);
renderRapport(parsed);
}catch(err){
var msg=(err.message.indexOf("Failed to fetch")>=0||err.message.indexOf("NetworkError")>=0||err.message.indexOf("CORS")>=0)?"De AI-service is momenteel niet bereikbaar. Controleer je verbinding en probeer het opnieuw.":"Controleer of de tekst een geldig (gepseudonimiseerd) medisch dossier bevat.";
document.getElementById("output").innerHTML='<div style="text-align:center;padding:3rem;color:#D94F4F"><p><strong>Fout bij verwerking:</strong> '+esc(err.message)+'</p><p style="margin-top:.5rem;color:var(--stone)">'+msg+'</p></div>';
}
btn.disabled=false;
btn.innerHTML="Maak conceptstructuur";
}

function init(){
if(!document.getElementById("output"))return;
var btns=document.querySelectorAll("[data-rapport-variant]");
btns.forEach(function(b){b.addEventListener("click",function(){
  btns.forEach(function(x){var on=x===b;x.classList.toggle("active",on);x.setAttribute("aria-pressed",String(on));});
  renderRapport(b.getAttribute("data-rapport-variant")==="nvmsr"?EXAMPLE_NVMSR:EXAMPLE_RAPPORT);
});});
renderRapport(EXAMPLE_RAPPORT);
}

// Herbruikbaar voor de tooling-werkruimte.
window.Kinetic=window.Kinetic||{};
window.Kinetic.renderRapport=renderRapport;
window.Kinetic.generateRapport=generateRapportData;

if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();
