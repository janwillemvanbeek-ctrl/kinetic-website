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
 "meta": {
  "zaaknummer": "2024-KME-01583",
  "betrokkene": "[PERSOON-1]",
  "geboortedatum": "[GEBOORTEDATUM]",
  "status": "Definitief",
  "specialisme": "Orthopedisch",
  "opdrachtgever": "[OPDRACHTGEVER]",
  "ongevalsdatum": "T±0",
  "onderzoeksdatum": "T+29m",
  "kicker": "Letselschade &middot; IWMD 2025 &middot; fictief voorbeeld",
  "titel": "Orthopedische expertise letselschade",
  "subtitel": "Vraagstelling volgens IWMD 2025",
  "kern": [
   {
    "label": "Diagnose (orthopedisch)",
    "waarde": "Chronische nekklachten met uitstraling naar de linker arm na een whiplashtrauma, bij pre-existente degeneratie C5–C6",
    "breed": true
   },
   {
    "label": "Relatie met het ongeval",
    "waarde": "Verenigbaar met aggravatie",
    "toelichting": "Van bestaande degeneratie C5–C6; bijdrage ongeval niet kwantificeerbaar"
   },
   {
    "label": "Eindsituatie",
    "waarde": "Stationair",
    "toelichting": "Voor de nekklachten; neurologisch deel nog niet"
   },
   {
    "label": "Beperkingen",
    "waarde": "Matig",
    "toelichting": "Statische nekbelasting, bovenhands werk"
   },
   {
    "label": "Aanvullend nodig",
    "waarde": "Neurologie",
    "toelichting": "Ulnarisklachten en cognitieve klachten"
   },
   {
    "label": "Functieverlies (AMA)",
    "waarde": "3%",
    "toelichting": "Gehele persoon, AMA Guides 6e druk; niet gelijk aan arbeidsongeschiktheid"
   },
   {
    "label": "Dossier",
    "waarde": "11 van 14 stukken",
    "toelichting": "3 hiaten, 3 aandachtspunten"
   }
  ],
  "ondertekening": {
   "arts": "[ARTS] · basisarts, BIG [BIG-NR]",
   "specialist": "Orthopedisch chirurg · BIG [BIG-NR]",
   "rollen": [
    [
     "Dossier geordend",
     "Kinetic, case manager [CASEMANAGER]"
    ],
    [
     "Anamnese en lichamelijk onderzoek",
     "[ARTS], basisarts"
    ],
    [
     "Concept opgesteld",
     "[ARTS], basisarts"
    ],
    [
     "Inhoudelijke supervisie",
     "Orthopedisch chirurg, BIG [BIG-NR]"
    ],
    [
     "Kernbevindingen geverifieerd",
     "Orthopedisch chirurg, bij eigen onderzoek van betrokkene op T+29m"
    ],
    [
     "Eindverantwoordelijk en ondertekend",
     "Orthopedisch chirurg, BIG [BIG-NR]"
    ]
   ],
   "status": "Definitief. Ondertekend op T+30m, na controle van vraagstelling en feitelijke gegevens door de opdrachtgever en inzage door betrokkene."
  }
 },
 "compleetheid": {
  "score": 79,
  "aanwezig": [
   "SEH-verslag met CT",
   "Huisartsbrief",
   "Huisartsjournaal",
   "Keuringsrapport werkgever",
   "Fysiotherapie intake",
   "MRI cervicaal",
   "Verwijsbrief pijnrevalidatie",
   "EMG-verslag",
   "Operatieverslag denervatie",
   "Brief neurologie",
   "Intake CGT"
  ],
  "ontbrekend": [
   {
    "doc": "Fysiotherapie eindverslag",
    "prio": "belangrijk"
   },
   {
    "doc": "Intake en voortgang pijnrevalidatie",
    "prio": "belangrijk"
   },
   {
    "doc": "Neuropsychologisch onderzoek",
    "prio": "belangrijk"
   }
  ]
 },
 "sections": [
  {
   "num": "–",
   "deel": "Dossier",
   "title": "Gegevens opdrachtgever en betrokkene",
   "badge": "ai",
   "type": "fields",
   "fields": [
    {
     "label": "Opdrachtgever",
     "value": "[OPDRACHTGEVER]"
    },
    {
     "label": "Advocaat betrokkene",
     "value": "[PERSOON-9], [ORGANISATIE-3]"
    },
    {
     "label": "Betrokkene",
     "value": "[PERSOON-1]"
    },
    {
     "label": "Geboortedatum",
     "value": "[GEBOORTEDATUM]"
    },
    {
     "label": "Ongeval",
     "value": "T±0: kop-staartbotsing als bestuurder"
    },
    {
     "label": "Datum onderzoek",
     "value": "T+29m"
    },
    {
     "label": "Specialisme",
     "value": "Orthopedie"
    }
   ]
  },
  {
   "num": "–",
   "title": "Kader van dit rapport",
   "badge": "ai",
   "type": "fields",
   "fields": [
    {
     "label": "Soort expertise",
     "value": "Letselschade: een ander is aansprakelijk voor het ongeval"
    },
    {
     "label": "Kernvraag",
     "value": "Wat is het verschil tussen de situatie met en zonder ongeval?"
    },
    {
     "label": "Doel van de uitkomst",
     "value": "Basis voor de berekening van de schadevergoeding door partijen"
    },
    {
     "label": "Partijen",
     "value": "Benadeelde en de verzekeraar van de aansprakelijke partij; bij voorkeur een gezamenlijke opdracht"
    },
    {
     "label": "Vraagstelling",
     "value": "IWMD 2025 (De Letselschade Raad)"
    },
    {
     "label": "Invaliditeitspercentage",
     "value": "Optioneel, vraag 1(l)"
    },
    {
     "label": "Richtlijn rapportage",
     "value": "NVMSR 2024"
    }
   ]
  },
  {
   "num": "–",
   "title": "Vraagstelling",
   "badge": "ai",
   "type": "text",
   "paragraphs": [
    "De opdrachtgever hanteert de IWMD-vraagstelling Causaal Verband bij Ongeval 2025. Deel 1 betreft de situatie met ongeval, deel 2 de situatie zonder ongeval en deel 3 overige opmerkingen. De vragen worden beantwoord voor het orthopedisch vakgebied; vraag 1(l) (functieverlies) is optioneel en door de opdrachtgever gevraagd."
   ],
   "sources": [
    "Opdrachtbrief [OPDRACHTGEVER]"
   ]
  },
  {
   "num": "–",
   "title": "Samenvatting medische informatie",
   "badge": "ai",
   "type": "text",
   "paragraphs": [
    "T±0 — SEH: WAD graad II; CT-cervicaal zonder fractuur, spondylose C5–C6 (bron 1, p. 2)\nT+2w — Huisarts: nekpijn met uitstraling naar de linker arm, verwijzing fysiotherapie (bron 2, p. 1)\nT+4w — Fysiotherapie intake: flexie 35°, extensie 25° (bron 5, p. 3)\nT+8m — MRI: discusdegeneratie C5–C6 met protrusie en foraminastenose links (bron 6, p. 1)\nT+10m — Verwijzing pijnrevalidatie (bron 7, p. 1)\nT+13m — EMG: geleidingsvertraging n. ulnaris ter hoogte van de linker elleboog, oorzaak niet te duiden (bron 8, p. 2)\nT+14m — Facetdenervatie C4–C6 (bron 9, p. 1)\nT+15m — Neuroloog: cervicobrachialgie links, ulnarisneuropathie, verdenking post-commotioneel syndroom (bron 10, p. 1–2)\nT+16m — Start cognitieve gedragstherapie (bron 11, p. 1)\nT+29m — Expertiseonderzoek"
   ],
   "sources": [
    "Bronnen 1, 2, 5–11"
   ]
  },
  {
   "num": "–",
   "title": "Hiaten in het dossier",
   "badge": "ai",
   "type": "hiaten",
   "hiaten": [
    {
     "prio": "belangrijk",
     "doc": "Fysiotherapie eindverslag",
     "verwacht": "T+4m",
     "toelichting": "Intake aanwezig (bron 5), maar geen afsluitend verslag. Het resultaat van de behandeling is niet vast te stellen.",
     "actie": "Opgevraagd bij [ORGANISATIE-6]; niet ontvangen. De conclusies in 1f houden hier rekening mee."
    },
    {
     "prio": "belangrijk",
     "doc": "Intake en voortgang pijnrevalidatie",
     "verwacht": "T+11m",
     "toelichting": "Verwijzing aanwezig (bron 7), maar geen intake of behandelplan.",
     "actie": "Opgevraagd bij [ORGANISATIE-7]; niet ontvangen. Niet bepalend voor de conclusies."
    },
    {
     "prio": "belangrijk",
     "doc": "Neuropsychologisch onderzoek",
     "verwacht": "T+15–24m",
     "toelichting": "De neuroloog noemt een verdenking op een post-commotioneel syndroom (bron 10); een neuropsychologisch onderzoek ontbreekt.",
     "actie": "Buiten het orthopedisch vakgebied; zie het advies in 3a."
    }
   ]
  },
  {
   "num": "–",
   "title": "Medische aandachtspunten en onzekerheden",
   "badge": "ai",
   "type": "tegenstrijdigheden",
   "items": [
    {
     "thema": "Cervicale afwijkingen: bestaand of door het ongeval?",
     "severity": "kritiek",
     "bronnen": [
      "CT T±0: spondylose C5–C6 (bron 1, p. 2)",
      "MRI T+8m: protrusie en foraminastenose links C5–C6 (bron 6, p. 1)",
      "Neuroloog T+15m: cervicobrachialgie, ‘traumatisch geagraveerd’ (bron 10, p. 2)"
     ],
     "relevantie": "De bronnen spreken elkaar niet tegen over de afwijking, maar wel over de betekenis ervan."
    },
    {
     "thema": "Ulnarisneuropathie: door het ongeval of niet?",
     "severity": "belangrijk",
     "bronnen": [
      "EMG T+13m: oorzaak niet te duiden (bron 8, p. 2)",
      "Neuroloog T+15m: ‘posttraumatisch’ (bron 10, p. 2)"
     ],
     "relevantie": "Valt buiten het orthopedisch vakgebied."
    },
    {
     "thema": "Cognitieve klachten",
     "severity": "aandacht",
     "bronnen": [
      "Neuroloog T+15m: verdenking post-commotioneel syndroom (bron 10, p. 2)",
      "Neuropsychologisch onderzoek ontbreekt"
     ],
     "relevantie": "Valt buiten het orthopedisch vakgebied."
    }
   ]
  },
  {
   "num": "1a",
   "title": "Anamnese",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Het relaas van betrokkene, zonder dossierinformatie.",
   "subfields": [
    {
     "label": "Ongeval en beloop volgens betrokkene",
     "tekst": "Betrokkene vertelt dat hij stilstond en van achteren werd aangereden. Hij had direct pijn in de nek en hoofdpijn. In de weken daarna kreeg hij pijn die uitstraalde naar de linker schouder en arm. Fysiotherapie en een behandeling met ‘verhitting van de zenuwtakjes’ in de nek hielpen volgens hem kort.",
     "context": null
    },
    {
     "label": "Huidige klachten",
     "tekst": "Dagelijks nekpijn, links meer dan rechts, erger na beeldschermwerk en autorijden. Tintelingen in de pink en ringvinger links. Hoofdpijn enkele keren per week. Moeite met concentratie.",
     "context": null
    },
    {
     "label": "Werk, huishouden en vrije tijd",
     "tekst": "Hij werkt als werkvoorbereider ongeveer 60% van zijn oude uren. Na een uur beeldschermwerk moet hij pauzeren. Klussen boven het hoofd laat hij over. Hardlopen heeft hij vervangen door wandelen.",
     "context": null
    }
   ],
   "deel": "Deel 1 · Situatie met ongeval"
  },
  {
   "num": "1b",
   "title": "Medische gegevens",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Voorgeschiedenis en behandeling op basis van het medisch dossier.",
   "subfields": [
    {
     "label": "Voorgeschiedenis",
     "tekst": "In de huisartsinformatie over de vijf jaar vóór het ongeval zijn geen nek- of schouderklachten gedocumenteerd. Op T−3j bezocht betrokkene de huisarts voor spanningshoofdpijn. Bij een keuring op T−19m was hij volledig arbeidsgeschikt.",
     "context": "Bron 3, p. 1–3; bron 4, p. 1."
    },
    {
     "label": "Behandeling na het ongeval",
     "tekst": "Fysiotherapie vanaf T+4w, verwijzing naar pijnrevalidatie op T+10m, facetdenervatie C4–C6 op T+14m en cognitieve gedragstherapie vanaf T+16m.",
     "context": "Bronnen 5, 7, 9 en 11. Het eindverslag van de fysiotherapie en de gegevens van de pijnrevalidatie ontbreken."
    }
   ]
  },
  {
   "num": "1c",
   "title": "Medisch onderzoek",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Bevindingen bij lichamelijk onderzoek en hulponderzoek.",
   "subfields": [
    {
     "label": "Algemeen",
     "tekst": "Verzorgde man, 182 cm, 84 kg. Wisselt tijdens het gesprek regelmatig van houding.",
     "context": null
    },
    {
     "label": "Cervicale wervelkolom",
     "tekst": "Geen standsafwijking. Drukpijn paravertebraal C4–C6 links met verhoogde spierspanning van de m. trapezius links. Eindstandige pijn bij extensie en rotatie naar links. Bewegingsuitslagen in de tabel hieronder.",
     "context": null
    },
    {
     "label": "Neurologisch, oriënterend",
     "tekst": "Kracht symmetrisch, reflexen symmetrisch. Spurling links positief met uitstraling naar de schouder, rechts negatief. Verminderd gevoel aan de radiale zijde van de linker onderarm en aan de pink en ringvinger links. Voor de duiding van de ulnarisklachten verwijs ik naar de neuroloog.",
     "context": null
    },
    {
     "label": "Hulponderzoek",
     "tekst": "Ik heb de beelden van de MRI van T+8m zelf bekeken; de bevindingen komen overeen met het verslag. Er is geen aanvullend onderzoek verricht.",
     "context": "Bron 6, p. 1."
    }
   ],
   "table": {
    "kolommen": [
     "Gemeten",
     "Algemene referentie*",
     "Methode",
     "Pijn"
    ],
    "rijen": [
     [
      "Flexie",
      "40°",
      "50°",
      "actief, 3×, goniometer",
      "eindstandig"
     ],
     [
      "Extensie",
      "30°",
      "60°",
      "actief, 3×, goniometer",
      "eindstandig"
     ],
     [
      "Rotatie links",
      "50°",
      "80°",
      "actief, 3×, goniometer",
      "eindstandig"
     ],
     [
      "Rotatie rechts",
      "60°",
      "80°",
      "actief, 3×, goniometer",
      "geen"
     ],
     [
      "Lateroflexie links",
      "25°",
      "45°",
      "actief, 3×, goniometer",
      "geen"
     ],
     [
      "Lateroflexie rechts",
      "25°",
      "45°",
      "actief, 3×, goniometer",
      "geen"
     ]
    ]
   },
   "tableNote": "* Algemene referentiewaarden uitsluitend ter klinische oriëntatie; zij vormen geen zelfstandige AMA-classificatie. Weergegeven is de beste reproduceerbare waarde van drie metingen."
  },
  {
   "num": "1d",
   "title": "Consistentie",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Samenhang tussen anamnese, medisch dossier en onderzoeksbevindingen.",
   "subfields": [
    {
     "label": "Oordeel",
     "tekst": "Het beloop dat betrokkene beschrijft, komt overeen met de medische informatie. De bevindingen bij onderzoek passen bij de klachten; de bewegingsbeperking was bij herhaling gelijk.",
     "context": null
    }
   ]
  },
  {
   "num": "1e",
   "title": "Reactie op inconsistenties",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Reactie van betrokkene op eventuele inconsistenties.",
   "subfields": [
    {
     "label": "Oordeel",
     "tekst": "Niet van toepassing; er zijn geen inconsistenties vastgesteld die met betrokkene moesten worden besproken.",
     "context": null
    }
   ]
  },
  {
   "num": "1f",
   "title": "Diagnose",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Diagnose en differentiaaldiagnostische overwegingen.",
   "subfields": [
    {
     "label": "Diagnose",
     "tekst": "Chronische nekklachten met uitstraling naar de linker arm na een whiplashtrauma (WAD graad II), bij pre-existente degeneratie C5–C6.",
     "context": null
    },
    {
     "label": "Differentiaaldiagnose",
     "tekst": "Ik onderscheid: (1) posttraumatische nekklachten zonder aantoonbare nieuwe structurele afwijking; (2) pre-existente, voor het ongeval symptoomloze degeneratie C5–C6; (3) een mogelijke traumatische verergering van die degeneratie; (4) een mogelijke radiculopathie C6 links; (5) een ulnarisneuropathie links, die buiten mijn vakgebied valt.",
     "context": null
    },
    {
     "label": "Conclusie",
     "tekst": "Er bestaat een temporeel verband tussen het ongeval en het ontstaan van de nekklachten. De beschikbare gegevens zijn verenigbaar met een traumatische aggravatie van reeds aanwezige cervicale degeneratieve afwijkingen. De relatieve bijdrage van het ongeval, de degeneratieve afwijkingen en eventuele neurologische problematiek is op basis van de beschikbare informatie niet kwantificeerbaar.",
     "context": null
    },
    {
     "label": "Basis",
     "tekst": "Vóór het ongeval zijn geen nekklachten gedocumenteerd, terwijl de degeneratie op de CT van de ongevalsdag al zichtbaar was. De klachten ontstonden direct na het ongeval en zijn sindsdien consistent beschreven. Het klachtenpatroon is verenigbaar met cervicale klachten bij de op beeldvorming beschreven afwijkingen op C5–C6; een zelfstandige C6-radiculopathie is hiermee niet aangetoond.",
     "context": "Bron 1, p. 2; bron 3, p. 1–3; bron 6, p. 1."
    },
    {
     "label": "Onzekerheid",
     "tekst": "Welk deel van de huidige klachten door het ongeval komt en welk deel door het natuurlijk beloop van de degeneratie, kan ik niet met redelijke zekerheid vaststellen. Ook of er sprake is van een zelfstandige radiculopathie C6 is niet zeker. Het eindverslag van de fysiotherapie zou het beloop in het eerste jaar kunnen verduidelijken.",
     "context": "Zie hiaat 1 en aandachtspunt 1."
    },
    {
     "label": "Buiten mijn vakgebied",
     "tekst": "De ulnarisklachten en de cognitieve klachten beoordeel ik niet; daarvoor adviseer ik een neurologische expertise.",
     "context": "Zie aandachtspunten 2 en 3."
    }
   ],
   "quote": "De beschikbare gegevens zijn verenigbaar met een traumatische aggravatie van reeds aanwezige degeneratieve afwijkingen. De relatieve bijdrage van het ongeval is niet kwantificeerbaar."
  },
  {
   "num": "1g",
   "title": "Beperkingen",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Semi-kwantitatief: geen, licht, matig, ernstig of volledig. Een FML stelt de bedrijfs- of verzekeringsarts op.",
   "subfields": [
    {
     "label": "Beperkingen op orthopedisch gebied",
     "tekst": "Betrokkene is orthopedisch bezien matig beperkt voor langdurige statische nekbelasting, repeterende eindstandige nekbewegingen en frequent bovenhands werken. Hij is licht beperkt voor tillen en niet beperkt voor lopen en staan. Voor een arbeidskundige vertaling naar concrete duur- of gewichtsgrenzen is afzonderlijk onderzoek aangewezen.",
     "context": null
    },
    {
     "label": "Basis",
     "tekst": "De beperkingen volgen uit de bewegingsbeperking en de pijn bij eindstandig bewegen bij onderzoek (1c), en passen bij het klachtenbeloop in het dossier.",
     "context": null
    },
    {
     "label": "Wat dit oordeel niet is",
     "tekst": "Dit is een medisch oordeel over beperkingen, geen oordeel over arbeidsongeschiktheid of belastbaarheid in het werk. Een FML en de vertaling naar werk zijn aan de bedrijfs- of verzekeringsarts.",
     "context": null
    }
   ]
  },
  {
   "num": "1h–k",
   "title": "Medische eindsituatie",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Is de situatie geschikt voor beoordeling, of is verbetering of verslechtering te verwachten?",
   "subfields": [
    {
     "label": "h. Geschikt voor beoordeling",
     "tekst": "Voor de orthopedische nekklachten acht ik de situatie stationair.",
     "context": null
    },
    {
     "label": "i–j. Te verwachten verandering",
     "tekst": "Gelet op duur en beloop acht ik verdere substantiële verbetering niet waarschijnlijk. Dit oordeel betreft niet de neurologische en cognitieve klachten, die nog onvoldoende zijn gedocumenteerd.",
     "context": null
    },
    {
     "label": "k. Gevolgen voor de beperkingen",
     "tekst": "Geen verandering verwacht in de beperkingen onder 1g.",
     "context": null
    }
   ]
  },
  {
   "num": "1(l)",
   "title": "Functieverlies (optioneel)",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Percentage functieverlies volgens de AMA Guides en de richtlijnen van de NOV. Dit betreft alleen algemene dagelijkse activiteiten, niet het beroep.",
   "subfields": [
    {
     "label": "Oordeel",
     "tekst": "3% functieverlies van de gehele persoon volgens de AMA Guides, 6e druk. De berekening staat per stap in de rekenbijlage.",
     "context": null
    },
    {
     "label": "Basis",
     "tekst": "De klachten zijn sinds het ongeval herhaald gedocumenteerd. Er zijn radiculaire klachten zonder objectiveerbare radiculopathie. Daarom is gekozen voor de rij aspecifieke nekklachten, niet voor de rij met discusafwijkingen en radiculopathie.",
     "context": "Zie 1c, 1f en aandachtspunt 1."
    },
    {
     "label": "Onzekerheid",
     "tekst": "De uitkomst is weinig gevoelig voor de functionele historie: met modifier 0 blijft het 3%. Telt het aanvullend onderzoek niet mee, dan is de uitkomst 2 tot 3%.",
     "context": null
    },
    {
     "label": "Wat dit percentage niet is",
     "tekst": "Functieverlies volgens de AMA Guides zegt iets over beperkingen in algemene dagelijkse activiteiten. Het is geen maat voor arbeidsongeschiktheid of verlies aan verdienvermogen.",
     "context": null
    }
   ],
   "stappen": [
    [
     "Editie en versie",
     "AMA Guides to the Evaluation of Permanent Impairment, 6e druk"
    ],
    [
     "Methode",
     "Diagnosegebonden (DBI), hoofdstuk 17, wervelkolom"
    ],
    [
     "Diagnoserij (tabel 17-2)",
     "Aspecifieke chronische nekklachten na sprain/strain-letsel, met aanhoudende axiale en niet-objectiveerbare radiculaire klachten, herhaald gedocumenteerd"
    ],
    [
     "Klasse",
     "Klasse 1: 1–3% gehele persoon (graad A–E: 1, 1, 2, 3, 3)"
    ],
    [
     "Standaardwaarde",
     "Graad C = 2%"
    ],
    [
     "Grade modifier functionele historie (tabel 17-6)",
     "1: pijnklachten bij normale activiteit"
    ],
    [
     "Grade modifier lichamelijk onderzoek (tabel 17-7)",
     "2: Spurling links positief met reproduceerbare uitstralende pijn"
    ],
    [
     "Grade modifier aanvullend onderzoek (tabel 17-9)",
     "2: MRI-bevindingen C5–C6 passend bij het klinisch beeld"
    ],
    [
     "Netto-aanpassing",
     "(1 − 1) + (2 − 1) + (2 − 1) = +2, dus graad E"
    ],
    [
     "Functieverlies gehele persoon",
     "3%"
    ]
   ]
  },
  {
   "num": "2a–b",
   "title": "Klachten en beperkingen vóór het ongeval",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Onderscheid tussen anamnese en medische broninformatie.",
   "subfields": [
    {
     "label": "Volgens betrokkene",
     "tekst": "Geen nek- of armklachten vóór het ongeval.",
     "context": null
    },
    {
     "label": "Volgens de broninformatie",
     "tekst": "In de huisartsinformatie over de vijf jaar vóór het ongeval zijn geen nek- of schouderklachten gedocumenteerd. De degeneratie C5–C6 bestond wel al; die is op de CT van de ongevalsdag beschreven.",
     "context": "Bron 1, p. 2; bron 3, p. 1–3."
    },
    {
     "label": "Beperkingen toen en nu door bestaande afwijkingen",
     "tekst": "Vóór het ongeval zijn geen beperkingen bekend.",
     "context": null
    }
   ],
   "deel": "Deel 2 · Situatie zonder ongeval"
  },
  {
   "num": "2c–d",
   "title": "Klachten zonder ongeval",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Aanwijzingen en inschatting: waarschijnlijkheid, termijn en omvang.",
   "subfields": [
    {
     "label": "Aanwijzingen",
     "tekst": "De degeneratie C5–C6 kan ook zonder ongeval nekklachten geven. Dat klachten na het ongeval voor het eerst zijn gemeld, is op zichzelf geen reden ze volledig aan het ongeval toe te schrijven.",
     "context": null
    },
    {
     "label": "Inschatting",
     "tekst": "Het is mogelijk dat zonder ongeval op termijn nekklachten waren ontstaan. Waarschijnlijkheid, moment en omvang daarvan zijn niet met redelijke zekerheid te bepalen.",
     "context": null
    }
   ]
  },
  {
   "num": "2e–i",
   "title": "Beperkingen en verloop zonder ongeval",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Semi-kwantitatief, met de verwachte ontwikkeling.",
   "subfields": [
    {
     "label": "Beperkingen zonder ongeval",
     "tekst": "Op dit moment waarschijnlijk geen tot licht beperkt.",
     "context": null
    },
    {
     "label": "Te verwachten ontwikkeling",
     "tekst": "Bij degeneratie van de nek is geleidelijke toename van klachten mogelijk, maar niet voorspelbaar. Een termijn en mate kan ik niet onderbouwd aangeven.",
     "context": null
    }
   ]
  },
  {
   "num": "3a",
   "title": "Verdere opmerkingen",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Relevante bevindingen buiten de vragen en therapeutische suggesties.",
   "subfields": [
    {
     "label": "Opmerkingen",
     "tekst": "Voor de ulnarisklachten en de cognitieve klachten adviseer ik een neurologische expertise, met neuropsychologisch onderzoek. Voortzetting van een actief oefenprogramma en ergonomische aanpassing van de werkplek zijn zinvol; van verdere invasieve behandeling verwacht ik weinig.",
     "context": null
    }
   ],
   "deel": "Deel 3 · Overig"
  },
  {
   "num": "–",
   "deel": "Verantwoording",
   "title": "Procedure en rolverdeling",
   "badge": "ai",
   "type": "fields",
   "fields": [
    {
     "label": "Opdracht",
     "value": "Opdrachtbrief [OPDRACHTGEVER], vraagstelling IWMD 2025"
    },
    {
     "label": "Machtiging",
     "value": "Getekende machtiging van betrokkene voor opvragen en gebruik medische gegevens"
    },
    {
     "label": "Dossierordening",
     "value": "Kinetic: ordening, tijdlijn, bronverwijzingen en hiaten, zonder medische duiding"
    },
    {
     "label": "Onderzoek",
     "value": "Anamnese en lichamelijk onderzoek door [ARTS], basisarts, onder supervisie van de specialist"
    },
    {
     "label": "Aanwezig bij onderzoek",
     "value": "Betrokkene en de onderzoekend arts; bij de verificatie betrokkene en de specialist"
    },
    {
     "label": "Verificatie en eindverantwoordelijkheid",
     "value": "De ondertekenend specialist heeft betrokkene zelf gezien op T+29m, de relevante orthopedische bevindingen geverifieerd en draagt de eindverantwoordelijkheid voor diagnose, beschouwing en conclusies"
    },
    {
     "label": "Opdrachtgever",
     "value": "Controleert vraagstelling, feitelijke gegevens en volledigheid; niet de medische inhoud"
    },
    {
     "label": "Richtlijn",
     "value": "NVMSR-richtlijn medisch specialistische rapportage 2024"
    }
   ]
  },
  {
   "num": "–",
   "title": "Inzage en blokkeringsrecht",
   "badge": "ai",
   "type": "fields",
   "fields": [
    {
     "label": "Gewezen op recht",
     "value": "Bij het onderzoek, mondeling en schriftelijk"
    },
    {
     "label": "Concept toegezonden",
     "value": "T+29m, met termijn van twee weken"
    },
    {
     "label": "Reactie betrokkene",
     "value": "Correctie van één feitelijke onjuistheid (werkuren); verwerkt in 1a"
    },
    {
     "label": "Blokkeringsrecht",
     "value": "Na inzage geen gebruik van gemaakt"
    }
   ]
  },
  {
   "num": "–",
   "title": "Disclosure statement",
   "badge": "ai",
   "type": "fields",
   "fields": [
    {
     "label": "Specialist",
     "value": "Specialisme orthopedie, BIG [BIG-NR]; werkzaam in [ORGANISATIE-9]"
    },
    {
     "label": "Onderzoekend arts",
     "value": "Basisarts, BIG [BIG-NR]; in dienst van Kinetic"
    },
    {
     "label": "Ervaring als deskundige",
     "value": "Specialist: ruim twintig jaar orthopedisch chirurg, circa 50 expertises per jaar; onderzoekend arts: drie jaar ervaring met expertiseonderzoek"
    },
    {
     "label": "Nevenfuncties",
     "value": "Geen nevenfuncties met een relatie tot partijen in deze zaak"
    },
    {
     "label": "Belangenconflicten",
     "value": "Geen; geen eerdere behandelrelatie met betrokkene en geen financieel belang bij de uitkomst"
    },
    {
     "label": "Relatie met de opdrachtgever",
     "value": "In de afgelopen twaalf maanden vier opdrachten van deze opdrachtgever; verhouding eisende en verwerende zijde ongeveer gelijk"
    },
    {
     "label": "Wetenschappelijke discussie",
     "value": "Over de betekenis van degeneratie na een whiplashtrauma bestaan uiteenlopende opvattingen; deze zijn meegewogen in 1f en deel 2"
    }
   ]
  },
  {
   "num": "–",
   "deel": "Bijlage",
   "title": "Bronnenlijst",
   "badge": "ai",
   "type": "bronnen",
   "bronnen": [
    {
     "nr": "1",
     "doc": "SEH-verslag met CT-cervicaal",
     "bron": "[ORGANISATIE-2]",
     "datum": "T±0",
     "paginas": "1–2"
    },
    {
     "nr": "2",
     "doc": "Huisartsbrief",
     "bron": "[ORGANISATIE-1]",
     "datum": "T+2w",
     "paginas": "1"
    },
    {
     "nr": "3",
     "doc": "Huisartsjournaal",
     "bron": "[ORGANISATIE-1]",
     "datum": "T−5j–T±0",
     "paginas": "1–3"
    },
    {
     "nr": "4",
     "doc": "Keuringsrapport werkgever",
     "bron": "[ORGANISATIE-4]",
     "datum": "T−19m",
     "paginas": "1"
    },
    {
     "nr": "5",
     "doc": "Fysiotherapie intake",
     "bron": "[ORGANISATIE-6]",
     "datum": "T+4w",
     "paginas": "1–3"
    },
    {
     "nr": "6",
     "doc": "MRI cervicale wervelkolom",
     "bron": "Radiologie [ORGANISATIE-2]",
     "datum": "T+8m",
     "paginas": "1"
    },
    {
     "nr": "7",
     "doc": "Verwijsbrief pijnrevalidatie",
     "bron": "[ORGANISATIE-7]",
     "datum": "T+10m",
     "paginas": "1–2"
    },
    {
     "nr": "8",
     "doc": "EMG-verslag",
     "bron": "Klinische neurofysiologie [ORGANISATIE-2]",
     "datum": "T+13m",
     "paginas": "1–2"
    },
    {
     "nr": "9",
     "doc": "Operatieverslag facetdenervatie",
     "bron": "Anesthesiologie [ORGANISATIE-2]",
     "datum": "T+14m",
     "paginas": "1"
    },
    {
     "nr": "10",
     "doc": "Brief neurologie",
     "bron": "Neurologie [ORGANISATIE-2]",
     "datum": "T+15m",
     "paginas": "1–2"
    },
    {
     "nr": "11",
     "doc": "Intake cognitieve gedragstherapie",
     "bron": "[ORGANISATIE-8]",
     "datum": "T+16m",
     "paginas": "1–2"
    }
   ]
  }
 ],
 "stats": {
  "bronnen": 11,
  "hiaten": 3
 }
};

/* Tweede voorbeeld: expertise voor een ongevallenverzekering (geen letselschade). Fictieve casus. */
var EXAMPLE_NVMSR = {
 "meta": {
  "zaaknummer": "2025-KME-01317",
  "betrokkene": "[PERSOON-1]",
  "geboortedatum": "[GEBOORTEDATUM]",
  "status": "Definitief",
  "specialisme": "Orthopedisch",
  "onderzoeksdatum": "T+24m",
  "kicker": "Ongevallenverzekering &middot; fictief voorbeeld",
  "titel": "Orthopedische expertise ongevallenverzekering",
  "subtitel": "Vraagstelling van de verzekeraar · blijvende invaliditeit",
  "kern": [
   {
    "label": "Diagnose",
    "waarde": "Lichte bewegingsbeperking en belastingspijn van de rechter knie na een tibiaplateaufractuur",
    "breed": true
   },
   {
    "label": "Relatie met het ongeval",
    "waarde": "Medisch aannemelijk",
    "toelichting": "Geen aanwijzingen voor een andere oorzaak"
   },
   {
    "label": "Eindsituatie",
    "waarde": "Bereikt",
    "toelichting": "Per T+24m"
   },
   {
    "label": "Voorafbestaand",
    "waarde": "Geen",
    "toelichting": "Geen knieklachten of afwijkingen bekend"
   },
   {
    "label": "Blijvende invaliditeit",
    "waarde": "19%",
    "toelichting": "Functieverlies rechterbeen, AMA Guides 6e druk"
   },
   {
    "label": "Dossier",
    "waarde": "8 van 9 stukken",
    "toelichting": "1 hiaat, niet bepalend"
   }
  ],
  "ondertekening": {
   "arts": "[ARTS] · basisarts, BIG [BIG-NR]",
   "specialist": "Orthopedisch chirurg · BIG [BIG-NR]",
   "rollen": [
    [
     "Dossier geordend",
     "Kinetic, case manager [CASEMANAGER]"
    ],
    [
     "Anamnese en lichamelijk onderzoek",
     "[ARTS], basisarts"
    ],
    [
     "Concept opgesteld",
     "[ARTS], basisarts"
    ],
    [
     "Inhoudelijke supervisie",
     "Orthopedisch chirurg, BIG [BIG-NR]"
    ],
    [
     "Kernbevindingen geverifieerd",
     "Orthopedisch chirurg, bij eigen onderzoek van betrokkene op T+24m"
    ],
    [
     "Eindverantwoordelijk en ondertekend",
     "Orthopedisch chirurg, BIG [BIG-NR]"
    ]
   ],
   "status": "Definitief. Ondertekend op T+25m, na controle van vraagstelling en feitelijke gegevens door de verzekeraar en inzage door betrokkene."
  }
 },
 "compleetheid": {
  "score": 89,
  "aanwezig": [
   "SEH-verslag met CT",
   "Operatieverslag",
   "Ontslagbrief",
   "Poliklinische brieven orthopedie",
   "Fysiotherapie intake en tussenrapportage",
   "Röntgenverslag controle",
   "Huisartsjournaal",
   "AAOS-vragenlijst"
  ],
  "ontbrekend": [
   {
    "doc": "Fysiotherapie eindverslag",
    "prio": "belangrijk"
   }
  ]
 },
 "sections": [
  {
   "num": "–",
   "deel": "Opdracht en polis",
   "title": "Gegevens verzekeraar en betrokkene",
   "badge": "ai",
   "type": "fields",
   "fields": [
    {
     "label": "Verzekeraar",
     "value": "[OPDRACHTGEVER]"
    },
    {
     "label": "Betrokkene",
     "value": "[PERSOON-1]"
    },
    {
     "label": "Geboortedatum",
     "value": "[GEBOORTEDATUM]"
    },
    {
     "label": "Beroep",
     "value": "Monteur installatietechniek"
    },
    {
     "label": "Ongeval",
     "value": "T±0: val van een trap tijdens werkzaamheden"
    },
    {
     "label": "Datum onderzoek",
     "value": "T+24m"
    }
   ]
  },
  {
   "num": "–",
   "title": "Kader van dit rapport",
   "badge": "ai",
   "type": "fields",
   "fields": [
    {
     "label": "Soort expertise",
     "value": "Ongevallenverzekering: een uitkering op grond van de eigen polis; geen aansprakelijkheid"
    },
    {
     "label": "Kernvraag",
     "value": "Hoeveel blijvend functieverlies is er, gemeten volgens de maatstaf van de polis?"
    },
    {
     "label": "Doel van de uitkomst",
     "value": "Basis voor een vaste uitkering: percentage maal verzekerd bedrag"
    },
    {
     "label": "Partijen",
     "value": "Verzekerde en de eigen verzekeraar; schuld speelt geen rol"
    },
    {
     "label": "Vraagstelling",
     "value": "Van de verzekeraar, gebaseerd op de polis"
    },
    {
     "label": "Invaliditeitspercentage",
     "value": "De hoofdvraag"
    },
    {
     "label": "Richtlijn rapportage",
     "value": "NVMSR 2024"
    }
   ]
  },
  {
   "num": "–",
   "title": "Polis en opdrachtkader",
   "badge": "ai",
   "type": "fields",
   "fields": [
    {
     "label": "Soort verzekering",
     "value": "Collectieve ongevallenverzekering via de werkgever; geen letselschadezaak"
    },
    {
     "label": "Polisnummer",
     "value": "[POLISNUMMER]"
    },
    {
     "label": "Polisvoorwaarden",
     "value": "[POLISVERSIE], artikel 7 (blijvende invaliditeit)"
    },
    {
     "label": "Begrip ongeval",
     "value": "Zoals omschreven in artikel 1 van de polis"
    },
    {
     "label": "Dekking als uitgangspunt",
     "value": "Ja; de verzekeraar heeft het voorval als gedekt ongeval aanvaard (opdrachtbrief)"
    },
    {
     "label": "Invaliditeitsmaatstaf",
     "value": "AMA Guides to the Evaluation of Permanent Impairment, 6e druk, uitgedrukt als percentage functieverlies van het betrokken lichaamsdeel"
    },
    {
     "label": "Maximum voor dit lichaamsdeel",
     "value": "70% voor volledig functieverlies van een been, volgens de polis"
    },
    {
     "label": "Peildatum en termijn",
     "value": "Vaststelling blijvende invaliditeit volgens de polis uiterlijk twee jaar na het ongeval"
    },
    {
     "label": "Voorafbestaande invaliditeit",
     "value": "Volgens de polis in mindering te brengen"
    },
    {
     "label": "Maatstaf",
     "value": "De specialist past uitsluitend de door de verzekeraar aangewezen medische maatstaf toe. De uitleg en toepassing van de polisvoorwaarden blijft voorbehouden aan de verzekeraar. Bij verschil tussen dit rapport en de polis prevaleert de polis."
    },
    {
     "label": "Rol van de deskundige",
     "value": "De deskundige beoordeelt uitsluitend de medische gevolgen en eventuele functionele invaliditeit. De uitleg van polisvoorwaarden en de beslissing over dekking zijn aan de verzekeraar."
    }
   ]
  },
  {
   "num": "–",
   "title": "Vragen van de verzekeraar",
   "badge": "ai",
   "type": "iwmd",
   "intro": "Zoals gesteld in de opdrachtbrief.",
   "questions": [
    "Wat is de aard van het letsel en de huidige diagnose?",
    "Zijn de huidige afwijkingen medisch het gevolg van het ongeval?",
    "Bestonden er vóór het ongeval klachten, afwijkingen of functieverlies aan het betrokken lichaamsdeel?",
    "Is er sprake van een medische eindsituatie? Zo nee, wanneer wordt die verwacht?",
    "Wat is de blijvende invaliditeit volgens de maatstaf in de polis, en welk deel daarvan bestond al vóór het ongeval?",
    "Heeft u overige opmerkingen?"
   ]
  },
  {
   "num": "–",
   "title": "Samenvatting medische informatie",
   "badge": "ai",
   "type": "text",
   "paragraphs": [
    "T±0 — SEH: laterale tibiaplateaufractuur rechts, split-depressie; CT: impressie 6 mm (bron 1, p. 1–2)\nT+3d — Operatie: open repositie, botplastiek en plaatosteosynthese (bron 2, p. 1)\nT+6w — Polikliniek: goede stand, start gedeeltelijk belasten en fysiotherapie (bron 4, p. 1)\nT+3m — Polikliniek: consolidatie, volledig belasten (bron 4, p. 2)\nT+5m — Fysiotherapie tussenrapportage: flexie 110°, loopt zonder hulpmiddel (bron 5, p. 3)\nT+12m — Polikliniek: restklachten bij lang lopen, geen verdere behandeling (bron 4, p. 4)\nT+22m — Röntgen: geconsolideerd, restcongruentie 2 mm, gewrichtsspleet behouden (bron 6, p. 1)\nT+24m — Expertiseonderzoek"
   ],
   "sources": [
    "Bronnen 1, 2, 4, 5, 6"
   ]
  },
  {
   "num": "–",
   "title": "Hiaten in het dossier",
   "badge": "ai",
   "type": "hiaten",
   "hiaten": [
    {
     "prio": "belangrijk",
     "doc": "Fysiotherapie eindverslag",
     "verwacht": "T+8m",
     "toelichting": "Intake en tussenrapportage aanwezig (bron 5), maar geen afsluitend verslag.",
     "actie": "Opgevraagd bij [ORGANISATIE-2]; niet ontvangen. Niet bepalend: het verdere beloop staat in de poliklinische brieven (bron 4)."
    }
   ]
  },
  {
   "num": "1",
   "title": "Aard van het letsel en diagnose",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Anamnese, medische gegevens, onderzoek en diagnose.",
   "subfields": [
    {
     "label": "Anamnese",
     "tekst": "Betrokkene vertelt dat hij van een trap viel en met gestrekt rechterbeen neerkwam. Hij werd geopereerd en liep enkele maanden met krukken. Nu heeft hij pijn aan de buitenzijde van de rechter knie na ongeveer een uur lopen en bij traplopen met gewicht. Hurken en knielen lukken slecht. Hij werkt weer volledig, maar vermijdt werk in geknielde houding. Geen pijnstillers; de plaat zit er nog.",
     "context": null
    },
    {
     "label": "Medische gegevens",
     "tekst": "Laterale tibiaplateaufractuur rechts, behandeld met open repositie en plaatosteosynthese op T+3d. Volledig belasten vanaf T+3m, fysiotherapie tot ongeveer T+8m. De röntgenfoto op T+22m toont een geconsolideerde fractuur met een restincongruentie van het gewrichtsvlak van 2 mm; de gewrichtsspleet is behouden.",
     "context": "Bronnen 1, 2, 4 en 6."
    },
    {
     "label": "Onderzoek",
     "tekst": "Loopt zonder hulpmiddel, zonder duidelijk manken. Rustig litteken van 14 cm aan de buitenzijde van de rechter knie. Geen hydrops. Lichte drukpijn over de laterale gewrichtsspleet, zonder zwelling of crepitaties. Stabiel bij Lachman en bij varus- en valgusstress. Klinisch geen asafwijking. Meetwaarden in de tabel.",
     "context": null
    },
    {
     "label": "Meetprotocol",
     "tekst": "Actieve bewegingsuitslag in rugligging, gemeten met een goniometer volgens de neutraal-nulmethode, drie keer per richting; vermeld is de hoogste waarde. Passief geen verdere uitslag. Omtrek met meetlint op vaste afstand van de bovenrand van de patella. Beide zijden in dezelfde volgorde gemeten. De metingen waren reproduceerbaar: per richting minder dan 5° verschil.",
     "context": null
    },
    {
     "label": "Diagnose",
     "tekst": "Lichte flexiebeperking en belastingspijn van de rechter knie bij een geconsolideerde laterale tibiaplateaufractuur met een restincongruentie van het gewrichtsvlak van 2 mm.",
     "context": null
    }
   ],
   "deel": "Beantwoording",
   "table": {
    "kolommen": [
     "Rechts (aangedaan)",
     "Links (contralaterale vergelijking)",
     "Algemene referentie*",
     "Klinische duiding",
     "Grade modifier (AMA 6e druk)"
    ],
    "rijen": [
     [
      "Extensie-flexie",
      "0-0-120",
      "0-0-140",
      "0-0-135",
      "lichte flexiebeperking",
      "1 (licht)"
     ],
     [
      "Omtrek bovenbeen, 10 cm boven patella",
      "49,5 cm",
      "51,0 cm",
      "—",
      "1,5 cm atrofie",
      "1 (1,0–1,9 cm)"
     ],
     [
      "Omtrek knie, midden patella",
      "40,0 cm",
      "39,5 cm",
      "—",
      "geen hydrops",
      "—"
     ],
     [
      "Stabiliteit",
      "stabiel",
      "stabiel",
      "—",
      "geen instabiliteit",
      "0"
     ],
     [
      "Stand (klinisch)",
      "neutraal",
      "neutraal",
      "—",
      "geen asafwijking",
      "0"
     ]
    ]
   },
   "tableNote": "* Algemene referentiewaarde uitsluitend ter klinische oriëntatie; zij vormt geen zelfstandige classificatie. De linkerzijde is een contralaterale vergelijking, geen referentie. Grade modifiers volgens tabel 16-7 van de AMA Guides, 6e druk."
  },
  {
   "num": "2",
   "title": "Relatie met het ongeval",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Is de huidige afwijking medisch het gevolg van het ongeval?",
   "subfields": [
    {
     "label": "Conclusie",
     "tekst": "Op basis van het letselmechanisme, het gedocumenteerde beloop en het huidige onderzoek acht ik de bewegingsbeperking en de belastingspijn medisch aannemelijk gerelateerd aan de tibiaplateaufractuur en de behandeling daarvan.",
     "context": null
    },
    {
     "label": "Basis",
     "tekst": "De fractuur is op de ongevalsdag met CT vastgesteld. De klachten zijn sindsdien consistent beschreven en passen bij de restincongruentie van het laterale gewrichtsvlak. Voor een oorzaak buiten het ongeval zijn geen aanwijzingen.",
     "context": "Bronnen 1, 4 en 6."
    },
    {
     "label": "Onzekerheid",
     "tekst": "Door de restincongruentie bestaat op lange termijn een verhoogd risico op artrose van het laterale compartiment. Dat is een risico, geen huidige afwijking, en telt niet mee in de huidige beoordeling.",
     "context": null
    },
    {
     "label": "Buiten mijn vakgebied",
     "tekst": "Niet van toepassing.",
     "context": null
    }
   ],
   "quote": "De bewegingsbeperking en de belastingspijn zijn medisch aannemelijk gerelateerd aan de tibiaplateaufractuur en de behandeling daarvan."
  },
  {
   "num": "3",
   "title": "Toestand vóór het ongeval",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Klachten, objectieve afwijkingen en functieverlies vóór het ongeval.",
   "subfields": [
    {
     "label": "Klachten",
     "tekst": "In de huisartsinformatie over vijf jaar voor het ongeval zijn geen knieklachten gedocumenteerd.",
     "context": "Bron 7, p. 1–2."
    },
    {
     "label": "Objectieve afwijkingen en functieverlies",
     "tekst": "Op de CT van de ongevalsdag zijn geen aanwijzingen voor bestaande artrose. De linker knie is bij onderzoek normaal.",
     "context": "Bron 1, p. 2."
    },
    {
     "label": "Conclusie",
     "tekst": "Er zijn geen aanwijzingen voor voorafbestaande invaliditeit van het rechterbeen.",
     "context": null
    }
   ]
  },
  {
   "num": "4",
   "title": "Medische eindsituatie",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Is de eindsituatie bereikt, en zo nee, wanneer?",
   "subfields": [
    {
     "label": "Oordeel",
     "tekst": "Gelet op de tijd sinds het ongeval, de behandeling, het huidige klinisch onderzoek en de beschikbare controle-informatie acht ik de orthopedische toestand stationair. De medische eindsituatie wordt vastgesteld per T+24m.",
     "context": null
    },
    {
     "label": "Basis",
     "tekst": "De fractuur is geconsolideerd. Sinds de polikliniek op T+12m zijn klachten en bevindingen gelijk gebleven, en er is geen verdere behandeling gepland.",
     "context": "Bron 4, p. 4; bron 6, p. 1."
    },
    {
     "label": "Onzekerheid",
     "tekst": "Het verwijderen van de plaat, als dat later gebeurt, verandert het functieverlies naar verwachting niet wezenlijk.",
     "context": null
    }
   ]
  },
  {
   "num": "5",
   "title": "Blijvende invaliditeit",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Volgens de maatstaf in de polis, met aftrek van voorafbestaande invaliditeit.",
   "subfields": [
    {
     "label": "Oordeel",
     "tekst": "19% functieverlies van het rechterbeen volgens de AMA Guides, 6e druk. Er is geen voorafbestaande invaliditeit om in mindering te brengen. De berekening staat per stap in de rekenbijlage.",
     "context": null
    },
    {
     "label": "Toepassing van de polis",
     "tekst": "De omzetting naar een uitkeringspercentage volgens de polis is aan de verzekeraar.",
     "context": null
    }
   ]
  },
  {
   "num": "6",
   "title": "Overige opmerkingen",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "",
   "subfields": [
    {
     "label": "Opmerkingen",
     "tekst": "Geen.",
     "context": null
    }
   ]
  },
  {
   "num": "–",
   "deel": "Verantwoording",
   "title": "Procedure en rolverdeling",
   "badge": "ai",
   "type": "fields",
   "fields": [
    {
     "label": "Opdracht",
     "value": "Opdrachtbrief [OPDRACHTGEVER] met vragen van de verzekeraar"
    },
    {
     "label": "Machtiging",
     "value": "Getekende machtiging van betrokkene"
    },
    {
     "label": "Dossierordening",
     "value": "Kinetic: ordening, tijdlijn, bronverwijzingen en hiaten, zonder medische duiding"
    },
    {
     "label": "Onderzoek",
     "value": "Anamnese en lichamelijk onderzoek door [ARTS], basisarts, onder supervisie van de specialist"
    },
    {
     "label": "Verificatie en eindverantwoordelijkheid",
     "value": "De ondertekenend specialist heeft betrokkene zelf gezien op T+24m, de relevante orthopedische bevindingen geverifieerd en draagt de eindverantwoordelijkheid voor diagnose, beschouwing en conclusies"
    },
    {
     "label": "Verzekeraar",
     "value": "Controleert vraagstelling, feitelijke gegevens en volledigheid; niet de medische inhoud"
    },
    {
     "label": "Richtlijn",
     "value": "NVMSR-richtlijn medisch specialistische rapportage 2024"
    }
   ]
  },
  {
   "num": "–",
   "title": "Inzage en blokkeringsrecht",
   "badge": "ai",
   "type": "fields",
   "fields": [
    {
     "label": "Gewezen op recht",
     "value": "Bij het onderzoek, mondeling en schriftelijk"
    },
    {
     "label": "Concept toegezonden",
     "value": "T+24m, met termijn van twee weken"
    },
    {
     "label": "Reactie betrokkene",
     "value": "Geen correcties"
    },
    {
     "label": "Blokkeringsrecht",
     "value": "Na inzage geen gebruik van gemaakt"
    }
   ]
  },
  {
   "num": "–",
   "title": "Disclosure statement",
   "badge": "ai",
   "type": "fields",
   "fields": [
    {
     "label": "Specialist",
     "value": "Specialisme orthopedie, BIG [BIG-NR]; werkzaam in [ORGANISATIE-9]"
    },
    {
     "label": "Onderzoekend arts",
     "value": "Basisarts, BIG [BIG-NR]; in dienst van Kinetic"
    },
    {
     "label": "Ervaring als deskundige",
     "value": "Specialist: ruim twintig jaar orthopedisch chirurg, circa 50 expertises per jaar; onderzoekend arts: drie jaar ervaring met expertiseonderzoek"
    },
    {
     "label": "Nevenfuncties",
     "value": "Geen nevenfuncties met een relatie tot partijen in deze zaak"
    },
    {
     "label": "Belangenconflicten",
     "value": "Geen; geen eerdere behandelrelatie met betrokkene en geen financieel belang bij de uitkomst"
    },
    {
     "label": "Relatie met de verzekeraar",
     "value": "In de afgelopen twaalf maanden zes opdrachten van deze verzekeraar"
    }
   ]
  },
  {
   "num": "B",
   "title": "Rekenbijlage blijvende invaliditeit",
   "badge": "arts",
   "type": "arts_template",
   "prompt": "Berekening volgens de AMA Guides, 6e druk, hoofdstuk 16 (onderste extremiteit).",
   "subfields": [
    {
     "label": "Methode",
     "tekst": "Diagnosegebonden methode (DBI). De bewegingsuitslag is niet als zelfstandige methode gebruikt, omdat er een passende diagnoserij is; de bewegingsbeperking telt mee als grade modifier.",
     "context": null
    },
    {
     "label": "Gevoeligheid",
     "tekst": "Wordt de grade modifier voor aanvullend onderzoek niet meegeteld, dan blijft de uitkomst 19%. De netto-aanpassing is dan −2 in plaats van −3, en beide leiden tot graad A.",
     "context": null
    }
   ],
   "deel": "Bijlage",
   "stappen": [
    [
     "Editie en versie",
     "AMA Guides to the Evaluation of Permanent Impairment, 6e druk"
    ],
    [
     "Diagnoserij (tabel 16-3, knie)",
     "Tibiaplateaufractuur met ≤ 2 mm stapvorming in het gewrichtsvlak"
    ],
    [
     "Klasse",
     "Klasse 2: 14–25% onderste extremiteit (graad A–E: 19, 20, 22, 24, 25)"
    ],
    [
     "Standaardwaarde",
     "Graad C = 22%"
    ],
    [
     "Grade modifier functionele historie (tabel 16-6)",
     "1: AAOS Lower Limb-vragenlijst licht verminderd; geen hulpmiddel"
    ],
    [
     "Grade modifier lichamelijk onderzoek (tabel 16-7)",
     "1: minimale palpatoire bevindingen, lichte bewegingsbeperking, 1,5 cm atrofie"
    ],
    [
     "Grade modifier aanvullend onderzoek (tabel 16-8)",
     "1: gewrichtsspleet minder dan 25% versmald ten opzichte van links. De stapvorming is al gebruikt voor de klasse en telt niet opnieuw mee"
    ],
    [
     "Netto-aanpassing",
     "(1 − 2) + (1 − 2) + (1 − 2) = −3; maximaal twee graden omlaag, dus graad A"
    ],
    [
     "Functieverlies onderste extremiteit",
     "19%"
    ],
    [
     "Aftrek voorafbestaande invaliditeit",
     "Niet van toepassing (vraag 3)"
    ],
    [
     "Uitkomst volgens de maatstaf van de polis",
     "19% functieverlies van het rechterbeen"
    ]
   ]
  },
  {
   "num": "–",
   "title": "Bronnenlijst",
   "badge": "ai",
   "type": "bronnen",
   "bronnen": [
    {
     "nr": "1",
     "doc": "SEH-verslag met CT rechter knie",
     "bron": "[ORGANISATIE-1]",
     "datum": "T±0",
     "paginas": "1–2"
    },
    {
     "nr": "2",
     "doc": "Operatieverslag plaatosteosynthese",
     "bron": "[ORGANISATIE-1]",
     "datum": "T+3d",
     "paginas": "1"
    },
    {
     "nr": "3",
     "doc": "Ontslagbrief",
     "bron": "[ORGANISATIE-1]",
     "datum": "T+6d",
     "paginas": "1"
    },
    {
     "nr": "4",
     "doc": "Poliklinische brieven orthopedie",
     "bron": "[ORGANISATIE-1]",
     "datum": "T+6w–T+12m",
     "paginas": "1–4"
    },
    {
     "nr": "5",
     "doc": "Fysiotherapie intake en tussenrapportage",
     "bron": "[ORGANISATIE-2]",
     "datum": "T+2m–T+5m",
     "paginas": "1–3"
    },
    {
     "nr": "6",
     "doc": "Röntgenverslag controle beide knieën",
     "bron": "Radiologie [ORGANISATIE-1]",
     "datum": "T+22m",
     "paginas": "1"
    },
    {
     "nr": "7",
     "doc": "Huisartsjournaal",
     "bron": "[ORGANISATIE-3]",
     "datum": "T−5j–T+24m",
     "paginas": "1–2"
    },
    {
     "nr": "8",
     "doc": "AAOS Lower Limb-vragenlijst",
     "bron": "Ingevuld door betrokkene",
     "datum": "T+24m",
     "paginas": "1–2"
    }
   ]
  }
 ],
 "stats": {
  "bronnen": 8,
  "hiaten": 1
 }
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
function layoutAxes(root){
  root.querySelectorAll('.kr-axis-track').forEach(function(tr){
    var evs=[].slice.call(tr.querySelectorAll('.kr-axis-ev')),placed=[[],[],[]];evs.forEach(function(e){e.classList.remove('kr-axis-hide');});
    evs.forEach(function(ev){
      var best=0,bestOv=Infinity;
      for(var l=0;l<3;l++){
        ev.className=ev.className.replace(/kr-lvl-\d/,'kr-lvl-'+l);
        var r=ev.querySelector('.kr-axis-lab').getBoundingClientRect(),ov=0;
        placed[l].forEach(function(q){var o=Math.min(r.right,q.right)-Math.max(r.left,q.left)+(ev.classList.contains('kr-axis-right')?14:2);if(o>0)ov+=o;});
        if(ov===0){best=l;bestOv=0;break;}
        if(ov<bestOv){bestOv=ov;best=l;}
      }
      ev.className=ev.className.replace(/kr-lvl-\d/,'kr-lvl-'+best);
      if(bestOv>0){ev.classList.add('kr-axis-hide');return;}
      placed[best].push(ev.querySelector('.kr-axis-lab').getBoundingClientRect());
    });
  });
}
function timelineAxis(lines){
  var ev=[],base=null;
  lines.forEach(function(line){
    var p=line.split(" — "),d=p.shift()||"",txt=p.join(" — ");
    var abs=/^\d{2}-\d{2}-\d{4}$/.test(d);
    if(abs&&base==null)base=tDays(d);
    var t=abs?tDays(d,base):tDays(d);
    if(t==null)return;
    var lab=txt.split(/[.:]/)[0].replace(/\s*\(.*$/,"").replace(/\[[A-Z0-9-]+\]/g,"").replace(/\s+/g," ").trim();
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

function caseEvents(data){
  var sec=data.sections.filter(function(x){return x.title==="Samenvatting medische informatie";})[0];
  if(!sec)return [];
  var lines=(sec.paragraphs[0]||"").split("\n"),ev=[],base=null;
  lines.forEach(function(line){
    var p=line.split(" — "),d=p.shift()||"",txt=p.join(" — ");
    var abs=/^\d{2}-\d{2}-\d{4}$/.test(d);if(abs&&base==null)base=tDays(d);
    var t=abs?tDays(d,base):tDays(d);if(t==null)return;
    ev.push({t:t,d:d,lab:txt.split(/[.:]/)[0].replace(/\s*\(.*$/,"").replace(/\[[A-Z0-9-]+\]/g,"").replace(/\s+/g," ").trim()});
  });
  return ev;
}
function coverLine(data){
  var ev=caseEvents(data);if(ev.length<2)return "";
  var max=Math.max.apply(null,ev.map(function(e){return e.t;}))||1,W=1000,x0=8,x1=W-8,LV=[30,66,102,138],y=172;
  var ends=[[],[],[],[]];
  ev.forEach(function(e){
    var x=e.t/max*W, w=Math.max(e.d.length*6.6,e.lab.length*6.4)+18, right=(e.t/max)>0.7;
    var lo=right?x-w:x, hi=right?x:x+w, pick=-1;
    for(var L=0;L<LV.length;L++){var ok=ends[L].every(function(r){return hi<r[0]||lo>r[1];});if(ok){pick=L;break;}}
    if(pick<0)pick=LV.length-1;
    ends[pick].push([lo,hi]);e.lv=pick;e.right=right;
  });
  var s='<svg class="kr-caseline" viewBox="0 0 '+W+' 190" preserveAspectRatio="none" aria-hidden="true">';
  s+='<line x1="'+x0+'" y1="'+y+'" x2="'+x1+'" y2="'+y+'" class="kr-cl-base"/>';
  for(var k=1;k<24;k++){var tx=x0+(x1-x0)*k/24;s+='<line x1="'+tx.toFixed(1)+'" y1="'+(y-3)+'" x2="'+tx.toFixed(1)+'" y2="'+(y+3)+'" class="kr-cl-tick"/>';}
  ev.forEach(function(e){
    var x=x0+(x1-x0)*e.t/max;
    s+='<line x1="'+x.toFixed(1)+'" y1="'+y+'" x2="'+x.toFixed(1)+'" y2="'+LV[e.lv]+'" class="kr-cl-stem"/>';
    s+='<circle cx="'+x.toFixed(1)+'" cy="'+y+'" r="4.5" class="kr-cl-dot"/>';
  });
  s+='</svg>';
  var lab='<div class="kr-caseline-labs">';
  ev.forEach(function(e){var x=e.t/max*100;lab+='<span class="kr-cl-lab'+(e.right?' kr-cl-r':'')+'" style="left:'+x.toFixed(2)+'%;top:'+LV[e.lv]+'px"><b>'+esc(e.d)+'</b>'+esc(e.lab)+'</span>';});
  lab+='</div>';
  return '<figure class="kr-caseline-wrap" aria-label="Het verloop van deze casus">'+lab+s+'<figcaption><span>Ongeval</span><span>'+fmtSpan(max)+'</span></figcaption></figure>';
}
function gonio(g){
  var cx=120,cy=118,r=96;
  function pt(deg,rad){var t=deg*Math.PI/180;return (cx+rad*Math.sin(t)).toFixed(1)+" "+(cy-rad*Math.cos(t)).toFixed(1);}
  function arc(a,b,rad){return "M "+pt(-a,rad)+" A "+rad+" "+rad+" 0 "+((a+b)>180?1:0)+" 1 "+pt(b,rad);}
  var pct=Math.round((g.a[0]+g.a[1])/(g.ref[0]+g.ref[1])*100);
  var s='<figure class="kr-gonio"><svg viewBox="0 0 240 140" aria-hidden="true">';
  s+='<path d="'+arc(90,90,r)+'" class="kr-g-frame"/>';
  [-90,-60,-30,0,30,60,90].forEach(function(d){s+='<line x1="'+pt(d,r-4).split(" ")[0]+'" y1="'+pt(d,r-4).split(" ")[1]+'" x2="'+pt(d,r+4).split(" ")[0]+'" y2="'+pt(d,r+4).split(" ")[1]+'" class="kr-g-tick"/>';});
  s+='<path d="'+arc(g.ref[0],g.ref[1],r-16)+'" class="kr-g-ref"/>';
  s+='<path d="'+arc(g.a[0],g.a[1],r-16)+'" class="kr-g-val"/>';
  s+='<line x1="'+cx+'" y1="'+cy+'" x2="'+pt(-g.a[0],r-16).split(" ")[0]+'" y2="'+pt(-g.a[0],r-16).split(" ")[1]+'" class="kr-g-ray"/>';
  s+='<line x1="'+cx+'" y1="'+cy+'" x2="'+pt(g.a[1],r-16).split(" ")[0]+'" y2="'+pt(g.a[1],r-16).split(" ")[1]+'" class="kr-g-ray"/>';
  s+='<circle cx="'+cx+'" cy="'+cy+'" r="3" class="kr-g-hub"/>';
  s+='<text x="'+cx+'" y="'+(cy-30)+'" class="kr-g-pct">'+pct+'%</text>';
  s+='</svg><figcaption><strong>'+esc(g.label)+'</strong><span><em>'+esc(g.namen[0])+'</em> '+g.a[0]+'° <i>/ '+g.ref[0]+'°</i></span><span><em>'+esc(g.namen[1])+'</em> '+g.a[1]+'° <i>/ '+g.ref[1]+'°</i></span></figcaption></figure>';
  return s;
}
function gonioSet(list,cap){
  var h='<div class="kr-gonioset"><div class="kr-gonio-head"><span>'+esc(cap||"Beweeglijkheid")+'</span><span class="kr-gonio-key"><i class="kr-k-val"></i>Gemeten <i class="kr-k-ref"></i>Referentie</span></div><div class="kr-gonio-grid">';
  list.forEach(function(g){h+=gonio(g);});
  return h+'</div></div>';
}

function redact(t){
  return esc(t).replace(/\[([A-Z][A-Z0-9-]*)\]/g,'<span class="kr-redact" title="Gepseudonimiseerd">$1</span>');
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
// tijdas op omslag verwijderd; de tijdlijn staat bij de samenvatting
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

var partNo=0;
data.sections.forEach(function(s,i){
if(s.deel){partNo++;var pt2=s.deel.split(" \u00b7 "),dm=pt2[0].match(/^Deel (\d+)$/),glyph=dm?dm[1]:(pt2.length>1?pt2[1]:pt2[0]).charAt(0);h+='<div class="kr-chapter"><span class="kr-chapter-no">'+esc(glyph)+'</span><div><span class="kr-chapter-kick">'+esc(pt2.length>1?pt2[0]:"Onderdeel")+'</span><span class="kr-chapter-title">'+esc(pt2.length>1?pt2[1]:pt2[0])+'</span></div></div>';}
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
if(s.quote)h+='<blockquote class="kr-quote"><p>'+redact(s.quote)+'</p><cite>'+esc(s.quoteBy||"De onderzoekend arts")+'</cite></blockquote>';
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
  if(s.tableNote)h+='<p class="kr-tablenote">'+redact(s.tableNote)+'</p>';
}
if(s.flow)h+=flow(s.flow);
if(s.stappen){h+='<div class="kr-reken"><div class="kr-reken-head"><span>Rekenbijlage</span><span>Controleerbaar per stap</span></div><ol>';s.stappen.forEach(function(st,si){var open=/in te vullen/i.test(st[1]);h+='<li'+(open?' class="kr-open"':'')+'><span class="kr-reken-no">'+(si+1)+'</span><span class="kr-reken-lab">'+esc(st[0])+'</span><span class="kr-reken-val">'+redact(st[1])+'</span></li>';});h+='</ol></div>';}
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
if(ot.rollen){h+='<dl class="kr-fields kr-sign-roles">';ot.rollen.forEach(function(r){h+='<div><dt>'+esc(r[0])+'</dt><dd>'+redact(r[1])+'</dd></div>';});h+='</dl>';}
h+='<p class="kr-sign-status">'+esc(ot.status||"Concept. Nog niet ondertekend.")+'</p>';
h+='</section>';

h+='<footer class="kr-foot"><span>Kinetic<i>.</i> Medische Expertises</span><span>Ingekort, fictief voorbeeld &middot; '+data.stats.bronnen+' bronnen &middot; '+data.stats.hiaten+(data.stats.hiaten===1?' hiaat':' hiaten')+'</span></footer>';
h+='</div></div></article>';

o.innerHTML=h;
try{layoutAxes(o);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){layoutAxes(o);});if(!o._axRs){o._axRs=1;var _t;window.addEventListener('resize',function(){clearTimeout(_t);_t=setTimeout(function(){layoutAxes(o);},150);});}}catch(e){}
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
function fromHash(){
  var start=/ongevallenverzekering|nvmsr/i.test(location.hash)?"nvmsr":"iwmd";
  btns.forEach(function(x){var on=x.getAttribute("data-rapport-variant")===start;x.classList.toggle("active",on);x.setAttribute("aria-pressed",String(on));});
  renderRapport(start==="nvmsr"?EXAMPLE_NVMSR:EXAMPLE_RAPPORT);
}
window.addEventListener("hashchange",fromHash);
fromHash();
}

// Herbruikbaar voor de tooling-werkruimte.
window.Kinetic=window.Kinetic||{};
window.Kinetic.renderRapport=renderRapport;
window.Kinetic.generateRapport=generateRapportData;

if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();
