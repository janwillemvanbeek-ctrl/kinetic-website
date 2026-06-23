/* ==========================================================================
   Pseudonymizer-demo — client-side detectie & vervanging
   Volledig client-side, geen API. Regex-patronen zijn gevalideerd: niet
   wijzigen zonder overleg (zie CLAUDE.md).
   Vereist assets/demo/layout.js (Kinetic-namespace, niet strikt nodig hier).
   ========================================================================== */
(function () {
"use strict";

var MED=['Morbus Bechterew','Nervus Medianus','Nervus Ulnaris','Nervus Radialis','Nervus Ischiadicus','Nervus Femoralis','Plexus Brachialis','Hernia Nuclei Pulposi','HNP','Carpal Tunnel Syndroom','CTS','Whiplash Associated Disorder','WAD','Post Commotioneel Syndroom','PCS','PTSS','Posttraumatisch Stressstoornis','CRPS','Complex Regionaal Pijnsyndroom','Sudeck','Fibromyalgie','Artrose','Osteoporose','Spondylodese','Spondylolisthesis','Discushernia','Discusdegeneratie','Radiculopathie','Cervicaal','Thoracaal','Lumbaal','Sacraal','Cervicobrachialgie','Lumboischialgie','Ischialgie','Scoliose','Kyfose','Lordose','Stenose','Foraminastenose','Myelopathie','Tendinitis','Tendinopathie','Bursitis','Epicondylitis','Impingement','Frozen Shoulder','Adhesieve Capsulitis','Instabiliteit','Meniscusletsel','Kruisbandletsel','VKB','AKB','Voorste Kruisband','Achterste Kruisband','Collaterale Band','Labrum','Bankart Laesie','SLAP Laesie','Rotatorcuff','Supraspinatus','Infraspinatus','Subscapularis','HWK','BWK','LWK','C1','C2','C3','C4','C5','C6','C7','Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12','L1','L2','L3','L4','L5','S1','S2','Processus Spinosus','Facetgewricht','Discus Intervertebralis','Ligamentum Flavum','Ligamentum Longitudinale','Dura Mater','Cauda Equina','Conus Medullaris','MRI','CT-scan','CT','EMG','Elektromyografie','Echografie','VAS-score','VAS','NDI','Neck Disability Index','DASH','Roland Morris','Oswestry','Oswestry Disability Index','ODI','WHODAS','Functionele Capaciteitsevaluatie','FCE','Belastbaarheidsonderzoek','Fysiotherapie','Manuele Therapie','Oefentherapie','Cesar','Mensendieck','TENS','Transcutane Elektrische Neurostimulatie','Infiltratie','Epiduraal','Facetdenervatie','Radiofrequente Denervatie','Discografie','Nucleoplastie','Foraminotomie','Laminectomie','Microdiscectomie','Prothese','Artrodese','Osteotomie','Arthroscopie','Revalidatie','Pijnrevalidatie','Graded Activity','Graded Exposure','Cognitieve Gedragstherapie','CGT','EMDR','ACT','Blijvende Invaliditeit','BI','Functionele Invaliditeit','FI','Arbeidsvermogensschade','Huishoudelijke Hulpbehoefte','HHB','Verlies Zelfwerkzaamheid','VSZ','Smartengeld','Shockschade','Affectieschade','AMA Guides','NVvN Richtlijnen','Verzekeringsgeneeskundige','Arbeidsdeskundige','Medisch Adviseur','Belangenbehartiger','Letselschade','Expertiserapport','Percentage Blijvende Invaliditeit','PBI','Proportionele Aansprakelijkheid','Causaal Verband','Conditio Sine Qua Non','CSQN','Pre-existentie','Predispositie','Ongevalsgevolg','Spurling test','Spurling','MRC','SEH','dermatoom','hypoesthesie','tricepsreflex','cervicale wervelkolom','cervicale mobiliteit'];
var sMed=MED.slice().sort(function(a,b){return b.length-a.length});

function isValidBSN(d){
if(d.length!==9||d==='000000000')return false;
var n=d.split('').map(Number);
var s=n[0]*9+n[1]*8+n[2]*7+n[3]*6+n[4]*5+n[5]*4+n[6]*3+n[7]*2-n[8]*1;
return s>0&&s%11===0;
}

var MO={januari:0,februari:1,maart:2,april:3,mei:4,juni:5,juli:6,augustus:7,september:8,oktober:9,november:10,december:11};
function pDate(s){
var m=s.match(/(\d{1,2})\s+(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)\s+(\d{4})/i);
if(m)return new Date(+m[3],MO[m[2].toLowerCase()],+m[1]);
var m2=s.match(/(\d{2})-(\d{2})-(\d{4})/);
if(m2)return new Date(+m2[3],+m2[2]-1,+m2[1]);
return null;
}
function dDiff(a,b){return Math.round((a-b)/864e5)}
function fmtT(d){
var sign=d>=0?'+':'';
var abs=Math.abs(d);
if(abs<=90)return 'T'+sign+d+'d';
if(abs<=730){var w=Math.round(abs/7);return 'T'+sign+(d>=0?w:-w)+'w (~'+abs+'d)';}
if(abs<=1095){var m=Math.round(abs/30.44);return 'T'+sign+(d>=0?m:-m)+'m (~'+abs+'d)';}
var y=(abs/365.25).toFixed(1);return 'T'+sign+(d>=0?'':'-')+y+'j (~'+abs+'d)';
}

function findAcc(t){
var ps=[/(?:ongeval|aanrijding|botsing|verkeersongeval)[\s\S]{0,80}?(\d{1,2}\s+(?:januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)\s+\d{4})/i,/(?:plaatsvond\s+op|d\.d\.)\s+(\d{1,2}\s+(?:januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)\s+\d{4})/i];
for(var i=0;i<ps.length;i++){var m=ps[i].exec(t);if(m){var d=pDate(m[1]);if(d)return d;}}
return null;
}

function protMed(t){
var pr=[];var r=t;
sMed.forEach(function(term,i){
var esc=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
var re=new RegExp('\\b'+esc+'\\b','gi');
r=r.replace(re,function(m){var p='\x00M'+i+'_'+pr.length+'\x00';pr.push({p:p,o:m});return p;});
});
return{t:r,pr:pr};
}
function restMed(t,pr){var r=t;pr.forEach(function(x){r=r.split(x.p).join(x.o);});return r;}

var nM={},nC=0,oM={},oC=0,S;
function gN(n){var k=n.toLowerCase().replace(/\s+/g,' ').trim();if(!nM[k]){nC++;nM[k]='PERSOON-'+nC;}S.names++;S.total++;return nM[k];}
function gO(o){var k=o.toLowerCase().trim();if(!oM[k]){oC++;oM[k]='ORG-'+oC;}S.orgs++;S.total++;return oM[k];}

function pseudo(text){
nM={};nC=0;oM={};oC=0;
S={total:0,bsn:0,names:0,dates:0,contact:0,orgs:0};
var aD=findAcc(text);
var pm=protMed(text);var r=pm.t;

// BSN
r=r.replace(/\b(\d{9})\b/g,function(m,d){if(isValidBSN(d)){S.bsn++;S.total++;return '[BSN]';}return m;});
// IBAN
r=r.replace(/\b[A-Z]{2}\d{2}[A-Z]{4}\d{10}\b/g,function(){S.contact++;S.total++;return '[IBAN]';});
// Email
r=r.replace(/[\w.-]+@[\w.-]+\.\w{2,}/g,function(){S.contact++;S.total++;return '[EMAIL]';});
// Phone
r=r.replace(/\b06[-\s]?\d{8}\b/g,function(){S.contact++;S.total++;return '[TELEFOON]';});
r=r.replace(/\b0\d{2}[-\s]?\d{7}\b/g,function(){S.contact++;S.total++;return '[TELEFOON]';});
// Known orgs
['Antonius Ziekenhuis','UMC Utrecht','Sint Maartenskliniek','Achmea Schadeverzekeringen','FysioFit Utrecht','Van Dongen & Partners Advocaten','Kliniek voor Neurologische Expertise'].forEach(function(o){
var re=new RegExp(o.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g');
r=r.replace(re,function(){return '['+gO(o)+']';});
});
// B.V./N.V.
r=r.replace(/\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*\s+B\.V\.)\b/g,function(m){if(m.indexOf('[ORG')>=0)return m;return '['+gO(m)+']';});
// Addresses
r=r.replace(/\b([A-Z][a-z]+(?:straat|laan|weg|plein|singel|gracht|kade|baan|park|dijk|dreef|hof|steeg))\s+(\d{1,4}(?:\s?[a-zA-Z])?)\b/g,function(){S.orgs++;S.total++;return '[ADRES]';});
// Postcodes
r=r.replace(/\b(\d{4})\s?([A-Z]{2})\b/g,function(m,n){var v=+n;if(v>=1000&&v<=9999){S.orgs++;S.total++;return '[POSTCODE]';}return m;});
// BIG
r=r.replace(/BIG-registratienummer:\s*\d+/g,function(){S.contact++;S.total++;return 'BIG-registratienummer: [BIG-NR]';});
// Dossier/polis
r=r.replace(/(polisnummer|dossiernummer)\s+[\w-]+/gi,function(m){S.orgs++;S.total++;return m.split(/\s+/)[0]+' [NUMMER]';});

// Dates -> T-notation (skip geboortedatum)
r=r.replace(/(geboortedatum|geboren|geb\.)\s*:?\s*(\d{1,2}\s+(?:januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)\s+\d{4})/gi,function(m,label){
S.dates++;S.total++;
return label+' [GEBOORTEDATUM]';
});
r=r.replace(/(\d{1,2})\s+(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)\s+(\d{4})/gi,function(m){
if(m.indexOf('GEBOORTEDATUM')>=0)return m;
var d=pDate(m);S.dates++;S.total++;
if(d&&aD){var diff=dDiff(d,aD);if(diff===0)return '[T±0 — ongevalsdatum]';return '['+fmtT(diff)+']';}
return '[DATUM]';
});

// Names
var ti='[Dd]r\\.?|[Dd]rs\\.?|[Mm]r\\.?|[Mm]evr\\.?|[Dd]hr\\.?|[Pp]rof\\.?|[Ii]ng\\.?|[Ii]r\\.?|[Bb]c\\.?';
var tv='van|de|der|den|het|ter|ten|te|op|in|bij|uit|tot|voor';
// Title + firstname + tussenvoegsel + surname
var r1=new RegExp('('+ti+')\\s+([A-Z][a-zéèëïöü]+)\\s+((?:(?:'+tv+')\\s+)+[A-Z][a-zéèëïöü]+(?:-[a-zA-Z][a-z]+)?)','g');
r=r.replace(r1,function(m,t,f,rest){if(m.indexOf('[PERSOON')>=0)return m;return t+' ['+gN(f+' '+rest)+']';});
// Title + initials + optional tussenvoegsel + surname (incl. hyphenated like Kramer-de Wit)
var r2=new RegExp('('+ti+')\\s+([A-Z]\\.(?:\\s?[A-Z]\\.)*\\s*)((?:(?:'+tv+')\\s+)*[A-Z][a-zéèëïöü]+(?:-(?:(?:'+tv+')\\s+)?[a-zA-Z][a-zéèëïöü]+)*)','g');
r=r.replace(r2,function(m,t,ini,sur){if(m.indexOf('[PERSOON')>=0)return m;return t+' ['+gN(ini.trim()+' '+sur)+']';});
// Title + Capitalised tussenvoegsel + surname (e.g. "mr. Van Dongen", "dr. De Vries")
var r4=new RegExp('('+ti+')\\s+((?:Van|De|Den|Der|Het|Ter|Ten|Te)\\s+[A-Z][a-zéèëïöü]+(?:-[a-zA-Z][a-zéèëïöü]+)*)','g');
r=r.replace(r4,function(m,t,name){if(m.indexOf('[PERSOON')>=0)return m;return t+' ['+gN(name)+']';});
// Title + firstname only (catch remaining)
var r3=new RegExp('('+ti+')\\s+([A-Z][a-zéèëïöü]{2,})\\b','g');
r=r.replace(r3,function(m,t,fn){if(m.indexOf('[PERSOON')>=0)return m;return t+' ['+gN(fn)+']';});

// Map standalone surname references (full tussenvoegsel+achternaam only)
var tvArr=tv.split('|');
for(var key in nM){
var kp=key.split(' ');
var tusIdx=-1;
for(var j=0;j<kp.length;j++){if(tvArr.indexOf(kp[j])>=0){tusIdx=j;break;}}
if(tusIdx>=0){
var surParts=kp.slice(tusIdx);
if(surParts.length<2)continue;
var surname=surParts.join(' ');
var capVar=surParts.map(function(w,i){return i===0?w.charAt(0).toUpperCase()+w.slice(1):w;}).join(' ');
[surname,capVar].forEach(function(v){
var esc=v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
var re=new RegExp('([\\s,.:;]|^)('+esc+')(?=[\\s,.:;\\n]|$)','g');
r=r.replace(re,function(mm,pre,name){if(!name||name.indexOf('[')>=0)return mm;S.names++;S.total++;return (pre||'')+'['+nM[key]+']';});
});
}
}

r=restMed(r,pm.pr);
return{text:r,stats:S};
}

function colorize(t){
t=t.replace(/\[T([^\]]+)\]/g,'<span class="ph ph-date">[T$1]</span>');
t=t.replace(/\[BSN\]/g,'<span class="ph ph-bsn">[BSN]</span>');
t=t.replace(/\[PERSOON-(\d+)\]/g,'<span class="ph ph-name">[PERSOON-$1]</span>');
t=t.replace(/\[DATUM\]/g,'<span class="ph ph-date">[DATUM]</span>');
t=t.replace(/\[GEBOORTEDATUM\]/g,'<span class="ph ph-date">[GEBOORTEDATUM]</span>');
t=t.replace(/\[TELEFOON\]/g,'<span class="ph ph-phone">[TELEFOON]</span>');
t=t.replace(/\[EMAIL\]/g,'<span class="ph ph-email">[EMAIL]</span>');
t=t.replace(/\[IBAN\]/g,'<span class="ph ph-iban">[IBAN]</span>');
t=t.replace(/\[ADRES\]/g,'<span class="ph ph-addr">[ADRES]</span>');
t=t.replace(/\[POSTCODE\]/g,'<span class="ph ph-pc">[POSTCODE]</span>');
t=t.replace(/\[ORG-(\d+)\]/g,'<span class="ph ph-org">[ORG-$1]</span>');
t=t.replace(/\[BIG-NR\]/g,'<span class="ph ph-bsn">[BIG-NR]</span>');
t=t.replace(/\[NUMMER\]/g,'<span class="ph ph-org">[NUMMER]</span>');
return t;
}

var SAMPLE="MEDISCH EXPERTISERAPPORT — LETSELSCHADE\n\nBetreft: Dhr. Johannes van der Berg\nGeboortedatum: 14 februari 1978\nBSN: 111222333\nDossiernummer: LS-2024-04892\n\nGeachte mr. Van Dongen,\n\nOp verzoek van uw kantoor, Van Dongen & Partners Advocaten te Rotterdam, heb ik op 23 april 2024 een neurologisch onderzoek verricht bij bovengenoemde betrokkene in verband met het verkeersongeval dat plaatsvond op 29 januari 2022.\n\nANAMNESE\nBetrokkene, dhr. J. van der Berg, was op 29 januari 2022 als bestuurder betrokken bij een kop-staartbotsing op de A27 ter hoogte van afslag Lexmond. Hij werd van achteren aangereden terwijl hij stilstond voor het verkeerslicht. Direct na het ongeval ervoer hij nekpijn en hoofdpijn. Hij werd per ambulance naar het Antonius Ziekenhuis te Nieuwegein vervoerd. De SEH-arts, dr. P.W.M. de Vries, constateerde een Whiplash Associated Disorder graad II.\n\nIn de weken na het ongeval ontwikkelde betrokkene toenemende klachten van:\n- Cervicobrachialgie links\n- Concentratiestoornissen passend bij Post Commotioneel Syndroom\n- Hoofdpijn, dagelijks, VAS-score 6-7\n- Tintelingen in de vingers (digiti III-V) links, passend bij Nervus Ulnaris irritatie ter hoogte van C7-Th1\n\nBetrokkene is werkzaam als projectmanager bij Strukton Rail B.V. en was voor het ongeval volledig arbeidsgeschikt. Sinds het ongeval is hij gedeeltelijk arbeidsongeschikt (50%).\n\nVOORGESCHIEDENIS\nBetrokkene was eerder onder behandeling bij dr. M.J. Bakker, reumatoloog in het UMC Utrecht, in verband met lichte artrose van de rechter knie (2019). Dit staat los van de huidige klachten.\n\nBEHANDELING SINDS ONGEVAL\n- 29 januari 2022: SEH Antonius Ziekenhuis, dr. De Vries\n- Februari - juni 2022: Fysiotherapie bij FysioFit Utrecht, behandelaar mevr. A. Kramer-de Wit\n- Augustus 2022: MRI cervicale wervelkolom (HWK): discusdegeneratie C5-C6, lichte foraminastenose rechts\n- Oktober 2022: Verwijzing naar pijnrevalidatie, Sint Maartenskliniek Nijmegen\n- Januari 2023: Facetdenervatie C4-C5 en C5-C6 door dr. R. Verhagen, anesthesioloog\n- Maart 2023 - heden: Cognitieve Gedragstherapie bij psycholoog drs. E.M. Jansen\n\nHUIDIG ONDERZOEK (23 april 2024)\nBij onderzoek op mijn polikliniek, Parkstraat 15 te Utrecht (tel: 030-2345678), presenteert betrokkene zich als een goed verzorgde man. Contactgegevens betrokkene: Kerkstraat 42, 3512 AB Utrecht, tel: 06-12345678, e-mail: j.vanderberg@gmail.com.\n\nNeurologisch onderzoek:\n- Cervicale mobiliteit: flexie 30° (normaal 50°), extensie 20° (normaal 60°), rotatie links 40° (normaal 80°)\n- Spurling test: positief links\n- Lichte hypoesthesie dermatoom C7 links\n- Kracht MRC 4+/5 triceps links\n- Reflexen: tricepsreflex links verlaagd\n\nCONCLUSIE\nEr is sprake van een Cervicobrachialgie links op basis van foraminastenose C5-C6 als gevolg van het verkeersongeval d.d. 29 januari 2022. De klachten zijn consistent met het ongevalsmechanisme. De pre-existente artrose van de rechter knie speelt geen rol in het huidige klachtenpatroon.\n\nOp basis van de AMA Guides (6e editie) en NVvN Richtlijnen begroting ik het Percentage Blijvende Invaliditeit op 7% van de gehele persoon.\n\nVerzekeringsgegevens: IBAN NL91ABNA0417164300, polisnummer 987654321 bij Achmea Schadeverzekeringen.\n\nMet collegiale hoogachting,\n\nDr. F.H. van Leeuwen\nNeuroloog\nBIG-registratienummer: 49123456701\nKliniek voor Neurologische Expertise\nMaliebaan 88, 3581 CV Utrecht";

var inp,outp;

function run(){
var t=inp.value.trim();
if(!t){outp.innerHTML='<span class="out-ph">Voer eerst tekst in of laad het voorbeeld.</span>';return;}
outp.classList.add('puls');
var res=pseudo(t);
var esc=res.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
outp.innerHTML=colorize(esc);
var st=res.stats;
document.getElementById('s0').textContent=st.total;
document.getElementById('s1').textContent=st.bsn;
document.getElementById('s2').textContent=st.names;
document.getElementById('s3').textContent=st.dates;
document.getElementById('s4').textContent=st.contact;
document.getElementById('s5').textContent=st.orgs;
document.getElementById('sg').classList.add('puls');
setTimeout(function(){outp.classList.remove('puls');document.getElementById('sg').classList.remove('puls');},600);
}

function reset(){
inp.value=SAMPLE;setTimeout(autoResize,0);
outp.innerHTML='<span class="out-ph">Klik op “Pseudonimiseer” om het resultaat te zien…</span>';
['s0','s1','s2','s3','s4','s5'].forEach(function(id){document.getElementById(id).textContent='0';});
}

function autoResize(){inp.style.height='auto';inp.style.height=inp.scrollHeight+'px';}

function init(){
inp=document.getElementById('inp');outp=document.getElementById('outp');
if(!inp||!outp)return;
document.getElementById('bp').addEventListener('click',run);
document.getElementById('br').addEventListener('click',reset);
inp.addEventListener('input',autoResize);
reset();
}

// Herbruikbaar voor de tooling-werkruimte: pseudonimiseer + kleur de output.
window.Kinetic=window.Kinetic||{};
window.Kinetic.pseudonymize=function(text){
var res=pseudo(text);
var escd=res.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
return {text:res.text,stats:res.stats,html:colorize(escd)};
};

if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();
