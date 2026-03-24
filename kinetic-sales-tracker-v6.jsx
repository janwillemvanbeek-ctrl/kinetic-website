import { useState, useEffect, useCallback, useRef } from "react";

// ─── KINETIC SALES TRACKER ─────────────────────────────────
// Supabase-backed CRM for Kinetic GTM v6
// Tracks letselschadekantoren, rechtsbijstand, verzekeraars

const SUPABASE_URL = "";
const SUPABASE_KEY = "";
const USE_SUPABASE = SUPABASE_URL && SUPABASE_KEY;

// ─── DEFAULT LEADS (GTM v6 shortlist) ───────────────────────
const DEFAULT_LEADS = [
  // Tier 1: Letselschadekantoren (Edwin)
  { id: "ls-01", naam: "SAP Letselschade", tier: "Letselschadekantoor", eigenaar: "Edwin", profiel: "Marktleider belangenbehartiging. Hoog volume.", contact: "Managing partner", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "ls-02", naam: "JBL&G", tier: "Letselschadekantoor", eigenaar: "Edwin", profiel: "Groot letselschadekantoor, landelijk.", contact: "Partner letselschade", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "ls-03", naam: "Beer Advocaten", tier: "Letselschadekantoor", eigenaar: "Edwin", profiel: "Gespecialiseerd letselschade, Amsterdam.", contact: "Senior advocaat", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "ls-04", naam: "De Ridder Letselschade", tier: "Letselschadekantoor", eigenaar: "Edwin", profiel: "Actief in persoonlijk letsel.", contact: "Directeur", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "ls-05", naam: "Slot Letselschade", tier: "Letselschadekantoor", eigenaar: "Edwin", profiel: "Middelgroot, korte lijnen.", contact: "Eigenaar", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "ls-06", naam: "Pals Letselschade", tier: "Letselschadekantoor", eigenaar: "Edwin", profiel: "Gevestigde naam.", contact: "Managing partner", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "ls-07", naam: "Hofmans Letselschade", tier: "Letselschadekantoor", eigenaar: "Edwin", profiel: "Specialist persoonlijk letsel.", contact: "Senior adviseur", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  // Tier 1b: Rechtsbijstandverzekeraars (Edwin)
  { id: "rb-01", naam: "DAS Rechtsbijstand", tier: "Rechtsbijstand", eigenaar: "Edwin", profiel: "Groot volume, eigen letselschade-afdeling.", contact: "Manager letselschade", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "rb-02", naam: "ARAG", tier: "Rechtsbijstand", eigenaar: "Edwin", profiel: "Actief in letselschade, koopt extern in.", contact: "Teamleider letselschade", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "rb-03", naam: "Achmea Rechtsbijstand", tier: "Rechtsbijstand", eigenaar: "Edwin", profiel: "Verbonden aan Interpolis.", contact: "Manager personenschade", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "rb-04", naam: "Univé Rechtshulp", tier: "Rechtsbijstand", eigenaar: "Edwin", profiel: "Regionale dekking.", contact: "Coördinator letselschade", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  // Tier 2: Schadeverzekeraars (Jan-Willem)
  { id: "vz-01", naam: "ASR", tier: "Verzekeraar", eigenaar: "Jan-Willem", profiel: "Grote personenschade-afdeling.", contact: "Manager personenschade", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "vz-02", naam: "Nationale-Nederlanden", tier: "Verzekeraar", eigenaar: "Jan-Willem", profiel: "Breed schadebedrijf.", contact: "Jeroen (bestaand contact)", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "vz-03", naam: "Allianz", tier: "Verzekeraar", eigenaar: "Jan-Willem", profiel: "Internationaal, NL letselschade.", contact: "Manager letselschade", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "vz-04", naam: "Achmea / Centraal Beheer", tier: "Verzekeraar", eigenaar: "Jan-Willem", profiel: "Grootste verzekeraar NL.", contact: "Inkoop-contact (bestaand)", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "vz-05", naam: "Aegon / a.s.r.", tier: "Verzekeraar", eigenaar: "Jan-Willem", profiel: "Actief in persoonlijk letsel.", contact: "Hoofd medische zaken", status: "Niet gebeld", reactie: "", notities: "", rapport_verstuurd: false, opvolg_datum: "" },
  // Geparkeerd: MA-bureaus
  { id: "ma-01", naam: "Triage Consult", tier: "Geparkeerd (MA)", eigenaar: "—", profiel: "Marktleider — ziet Kinetic als concurrent.", contact: "Directeur", status: "Geparkeerd", reactie: "", notities: "Herbenader na 3+ pilots", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "ma-02", naam: "MAB", tier: "Geparkeerd (MA)", eigenaar: "—", profiel: "Verbonden aan JBL&G.", contact: "", status: "Geparkeerd", reactie: "", notities: "Via JBL&G-relatie na pilot", rapport_verstuurd: false, opvolg_datum: "" },
  { id: "ma-03", naam: "ArtsTotaal", tier: "Geparkeerd (MA)", eigenaar: "—", profiel: "Eigen platform.", contact: "", status: "Geparkeerd", reactie: "", notities: "Na pilotresultaten", rapport_verstuurd: false, opvolg_datum: "" },
];

const STATUSES = [
  "Niet gebeld",
  "Gebeld — stuur rapport",
  "Rapport verstuurd",
  "Opvolgcall gedaan",
  "Gesprek gepland",
  "Pilot bevestigd",
  "Niet geïnteresseerd",
  "Geparkeerd",
];

const STATUS_COLORS = {
  "Niet gebeld": { bg: "#F5F3EF", text: "#78716C", dot: "#78716C" },
  "Gebeld — stuur rapport": { bg: "#FEF3C7", text: "#92400E", dot: "#E8A838" },
  "Rapport verstuurd": { bg: "#DBEAFE", text: "#1E40AF", dot: "#3B82F6" },
  "Opvolgcall gedaan": { bg: "#E0E7FF", text: "#3730A3", dot: "#6366F1" },
  "Gesprek gepland": { bg: "#D1FAE5", text: "#065F46", dot: "#10B981" },
  "Pilot bevestigd": { bg: "#D1FAE5", text: "#065F46", dot: "#059669" },
  "Niet geïnteresseerd": { bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" },
  "Geparkeerd": { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" },
};

const TIER_COLORS = {
  "Letselschadekantoor": "#2F6F6A",
  "Rechtsbijstand": "#1E40AF",
  "Verzekeraar": "#7C3AED",
  "Geparkeerd (MA)": "#9CA3AF",
};

// ─── SUPABASE HELPERS ───────────────────────────────────────
async function supaFetch(path, opts = {}) {
  if (!USE_SUPABASE) return null;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: opts.method === "POST" ? "return=representation" : "return=minimal",
      ...opts.headers,
    },
  });
  if (!res.ok) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ─── STORAGE (persistent across sessions) ─────────
const STORAGE_KEY = "kinetic-sales-tracker";

async function loadLeadsAsync() {
  try {
    const result = await window.storage.get(STORAGE_KEY);
    return result ? JSON.parse(result.value) : null;
  } catch {
    return null;
  }
}

async function saveLeadsAsync(leads) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(leads));
  } catch {}
}

// ─── MAIN COMPONENT ────────────────────────────────────────
export default function KineticSalesTracker() {
  const [leads, setLeads] = useState(DEFAULT_LEADS);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("Alle");
  const [tierFilter, setTierFilter] = useState("Alle");
  const [eigenaarFilter, setEigenaarFilter] = useState("Alle");
  const [editingId, setEditingId] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [supaUrl, setSupaUrl] = useState(SUPABASE_URL);
  const [supaKey, setSupaKey] = useState(SUPABASE_KEY);
  const [synced, setSynced] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newLead, setNewLead] = useState({ naam: "", tier: "Letselschadekantoor", eigenaar: "Edwin", profiel: "", contact: "" });

  // Load persisted data on mount
  useEffect(() => {
    loadLeadsAsync().then(stored => {
      if (stored && stored.length > 0) setLeads(stored);
      setLoaded(true);
    });
  }, []);

  // Persist on change (only after initial load)
  useEffect(() => { if (loaded) saveLeadsAsync(leads); }, [leads, loaded]);

  const updateLead = useCallback((id, field, value) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  }, []);

  const addLead = useCallback(() => {
    if (!newLead.naam.trim()) return;
    const id = `custom-${Date.now()}`;
    setLeads(prev => [...prev, {
      ...newLead, id, status: "Niet gebeld", reactie: "", notities: "",
      rapport_verstuurd: false, opvolg_datum: ""
    }]);
    setNewLead({ naam: "", tier: "Letselschadekantoor", profiel: "", contact: "" });
    setShowAdd(false);
  }, [newLead]);

  const removeLead = useCallback((id) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  }, []);

  const resetData = useCallback(() => {
    if (confirm("Alle data resetten naar standaard leadlijst?")) {
      setLeads(DEFAULT_LEADS);
    }
  }, []);

  // Stats
  const stats = {
    total: leads.length,
    gebeld: leads.filter(l => l.status !== "Niet gebeld" && l.status !== "Geparkeerd").length,
    pilot: leads.filter(l => l.status === "Pilot bevestigd").length,
    nee: leads.filter(l => l.status === "Niet geïnteresseerd").length,
    gepland: leads.filter(l => l.status === "Gesprek gepland").length,
    edwin: leads.filter(l => l.eigenaar === "Edwin" && l.status !== "Niet gebeld" && l.status !== "Geparkeerd").length,
    edwinTotal: leads.filter(l => l.eigenaar === "Edwin").length,
    jw: leads.filter(l => l.eigenaar === "Jan-Willem" && l.status !== "Niet gebeld" && l.status !== "Geparkeerd").length,
    jwTotal: leads.filter(l => l.eigenaar === "Jan-Willem").length,
  };

  // Filtered leads
  const filtered = leads.filter(l => {
    if (filter !== "Alle" && l.status !== filter) return false;
    if (tierFilter !== "Alle" && l.tier !== tierFilter) return false;
    if (eigenaarFilter !== "Alle" && l.eigenaar !== eigenaarFilter) return false;
    return true;
  });

  const tiers = ["Alle", ...new Set(leads.map(l => l.tier))];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', -apple-system, sans-serif", background: "#FAF9F7", minHeight: "100vh", color: "#2C2926" }}>
      {/* Header */}
      <div style={{ background: "#1A2332", padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 24, fontWeight: 700, color: "#FAF9F7", letterSpacing: "-0.01em" }}>
            KINETIC
            <span style={{ color: "#E8A838", marginLeft: 8, fontSize: 14, fontWeight: 400, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Sales Tracker</span>
          </div>
          <div style={{ fontSize: 12, color: "#78716C", marginTop: 4 }}>GTM v6 — Letselschade & Verzekeraars</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowAdd(!showAdd)} style={btnStyle("#2F6F6A")}>+ Lead</button>
          <button onClick={() => setShowConfig(!showConfig)} style={btnStyle("#78716C")}>⚙ Supabase</button>
          <button onClick={resetData} style={btnStyle("#991B1B")}>↺ Reset</button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: 16, padding: "16px 32px", background: "#fff", borderBottom: "1px solid #E7E5E0", overflowX: "auto" }}>
        {[
          { label: "Totaal", value: stats.total, color: "#2C2926" },
          { label: `Edwin (${stats.edwin}/${stats.edwinTotal})`, value: stats.edwin, color: "#2F6F6A" },
          { label: `Jan-Willem (${stats.jw}/${stats.jwTotal})`, value: stats.jw, color: "#7C3AED" },
          { label: "Gesprek gepland", value: stats.gepland, color: "#10B981" },
          { label: "Pilot bevestigd", value: stats.pilot, color: "#059669" },
          { label: "Niet geïnteresseerd", value: stats.nee, color: "#EF4444" },
        ].map(s => (
          <div key={s.label} style={{ minWidth: 120, padding: "12px 16px", background: "#F5F3EF", borderRadius: 6, borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Supabase config panel */}
      {showConfig && (
        <div style={{ padding: "16px 32px", background: "#FEF3C7", borderBottom: "1px solid #E8A838" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "#92400E" }}>Supabase configuratie</div>
          <div style={{ fontSize: 12, color: "#78716C", marginBottom: 12 }}>Maak een tabel 'kinetic_leads' met kolommen: id (text, PK), naam, tier, profiel, contact, status, reactie, notities, rapport_verstuurd (bool), opvolg_datum (text). Zet RLS uit voor development.</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input placeholder="Supabase URL" value={supaUrl} onChange={e => setSupaUrl(e.target.value)} style={inputStyle} />
            <input placeholder="Supabase Anon Key" value={supaKey} onChange={e => setSupaKey(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
            <button onClick={async () => {
              // Sync: push local leads to Supabase
              if (!supaUrl || !supaKey) return;
              for (const lead of leads) {
                await fetch(`${supaUrl}/rest/v1/kinetic_leads`, {
                  method: "POST",
                  headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
                  body: JSON.stringify(lead)
                });
              }
              setSynced(true);
              setTimeout(() => setSynced(false), 3000);
            }} style={btnStyle("#2F6F6A")}>
              {synced ? "✓ Gesynct" : "Sync naar Supabase"}
            </button>
          </div>
        </div>
      )}

      {/* Add lead panel */}
      {showAdd && (
        <div style={{ padding: "16px 32px", background: "#EEF2FF", borderBottom: "1px solid #C7D2FE" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <input placeholder="Naam" value={newLead.naam} onChange={e => setNewLead(p => ({ ...p, naam: e.target.value }))} style={inputStyle} />
            <select value={newLead.tier} onChange={e => setNewLead(p => ({ ...p, tier: e.target.value }))} style={inputStyle}>
              <option>Letselschadekantoor</option>
              <option>Rechtsbijstand</option>
              <option>Verzekeraar</option>
              <option>Geparkeerd (MA)</option>
            </select>
            <input placeholder="Profiel" value={newLead.profiel} onChange={e => setNewLead(p => ({ ...p, profiel: e.target.value }))} style={{ ...inputStyle, flex: 2 }} />
            <input placeholder="Contact" value={newLead.contact} onChange={e => setNewLead(p => ({ ...p, contact: e.target.value }))} style={inputStyle} />
            <button onClick={addLead} style={btnStyle("#2F6F6A")}>Toevoegen</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ padding: "12px 32px", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 4 }}>Track:</span>
        {["Alle", "Edwin", "Jan-Willem", "—"].map(e => (
          <button key={e} onClick={() => setEigenaarFilter(e)} style={{
            padding: "4px 12px", borderRadius: 4, border: "1px solid #E7E5E0", cursor: "pointer", fontSize: 12, fontWeight: 500,
            background: eigenaarFilter === e ? (e === "Edwin" ? "#2F6F6A" : e === "Jan-Willem" ? "#7C3AED" : "#1A2332") : "#fff",
            color: eigenaarFilter === e ? "#FAF9F7" : "#2C2926",
          }}>{e === "—" ? "Geparkeerd" : e}</button>
        ))}
        <span style={{ fontSize: 11, fontWeight: 600, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 4px 0 16px" }}>Tier:</span>
        {tiers.map(t => (
          <button key={t} onClick={() => setTierFilter(t)} style={{
            padding: "4px 12px", borderRadius: 4, border: "1px solid #E7E5E0", cursor: "pointer", fontSize: 12, fontWeight: 500,
            background: tierFilter === t ? "#1A2332" : "#fff", color: tierFilter === t ? "#FAF9F7" : "#2C2926",
          }}>{t}</button>
        ))}
        <span style={{ fontSize: 11, fontWeight: 600, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 4px 0 16px" }}>Status:</span>
        {["Alle", ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "4px 12px", borderRadius: 4, border: "1px solid #E7E5E0", cursor: "pointer", fontSize: 12, fontWeight: 500,
            background: filter === s ? "#1A2332" : "#fff", color: filter === s ? "#FAF9F7" : "#2C2926",
          }}>{s === "Alle" ? "Alle" : s}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ padding: "0 32px 32px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#1A2332", color: "#FAF9F7" }}>
              {["Naam", "Tier", "Eigenaar", "Contact", "Status", "Rapport?", "Reactie / Notities", "Opvolg", ""].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead, i) => {
              const sc = STATUS_COLORS[lead.status] || STATUS_COLORS["Niet gebeld"];
              const tc = TIER_COLORS[lead.tier] || "#78716C";
              const isEditing = editingId === lead.id;
              return (
                <tr key={lead.id} onClick={() => setEditingId(isEditing ? null : lead.id)} style={{
                  background: i % 2 === 0 ? "#fff" : "#FAFAF8", cursor: "pointer",
                  borderLeft: isEditing ? `3px solid ${tc}` : "3px solid transparent",
                  transition: "all 0.15s ease",
                }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>
                    <div>{lead.naam}</div>
                    <div style={{ fontSize: 11, color: "#78716C", fontWeight: 400 }}>{lead.profiel}</div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 3, fontSize: 11, fontWeight: 600, color: "#fff", background: tc }}>{lead.tier}</span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: lead.eigenaar === "Edwin" ? "#2F6F6A" : lead.eigenaar === "Jan-Willem" ? "#7C3AED" : "#9CA3AF" }}>{lead.eigenaar}</span>
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 12 }}>
                    {isEditing ? (
                      <input value={lead.contact} onChange={e => updateLead(lead.id, "contact", e.target.value)} onClick={e => e.stopPropagation()} style={cellInput} />
                    ) : lead.contact}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    {isEditing ? (
                      <select value={lead.status} onChange={e => updateLead(lead.id, "status", e.target.value)} onClick={e => e.stopPropagation()} style={{ ...cellInput, background: sc.bg, color: sc.text }}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 4, fontSize: 12, fontWeight: 500, background: sc.bg, color: sc.text }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: sc.dot }} />
                        {lead.status}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    <input type="checkbox" checked={lead.rapport_verstuurd} onChange={e => { e.stopPropagation(); updateLead(lead.id, "rapport_verstuurd", e.target.checked); }} style={{ width: 16, height: 16, accentColor: "#2F6F6A" }} />
                  </td>
                  <td style={{ padding: "10px 12px", minWidth: 200 }}>
                    {isEditing ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <input placeholder="Reactie..." value={lead.reactie} onChange={e => updateLead(lead.id, "reactie", e.target.value)} onClick={e => e.stopPropagation()} style={cellInput} />
                        <input placeholder="Notities..." value={lead.notities} onChange={e => updateLead(lead.id, "notities", e.target.value)} onClick={e => e.stopPropagation()} style={cellInput} />
                      </div>
                    ) : (
                      <div>
                        {lead.reactie && <div style={{ fontSize: 12 }}>{lead.reactie}</div>}
                        {lead.notities && <div style={{ fontSize: 11, color: "#78716C", fontStyle: "italic" }}>{lead.notities}</div>}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    {isEditing ? (
                      <input type="date" value={lead.opvolg_datum} onChange={e => updateLead(lead.id, "opvolg_datum", e.target.value)} onClick={e => e.stopPropagation()} style={cellInput} />
                    ) : (
                      <span style={{ fontSize: 12, color: lead.opvolg_datum ? "#2F6F6A" : "#D4D0C8" }}>{lead.opvolg_datum || "—"}</span>
                    )}
                  </td>
                  <td style={{ padding: "10px 8px" }}>
                    {isEditing && (
                      <button onClick={e => { e.stopPropagation(); removeLead(lead.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#991B1B", fontSize: 16, padding: 4 }}>✕</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#78716C" }}>Geen leads gevonden voor dit filter.</div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 32px", borderTop: "1px solid #E7E5E0", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#78716C" }}>
        <div>Klik op een rij om te bewerken. Data wordt persistent opgeslagen.</div>
        <div>Kinetic GTM v6 — Edwin: {stats.edwinTotal} leads | Jan-Willem: {stats.jwTotal} leads — {stats.pilot}/3 pilots bevestigd</div>
      </div>
    </div>
  );
}

// ─── STYLES ─────────────────────────────────────────────────
const btnStyle = (bg) => ({
  padding: "6px 14px", borderRadius: 4, border: "none", cursor: "pointer",
  fontSize: 12, fontWeight: 600, color: "#fff", background: bg,
  transition: "opacity 0.15s", whiteSpace: "nowrap",
});

const inputStyle = {
  padding: "6px 10px", borderRadius: 4, border: "1px solid #D4D0C8",
  fontSize: 13, fontFamily: "'DM Sans', sans-serif", flex: 1, minWidth: 140,
  outline: "none", background: "#fff",
};

const cellInput = {
  padding: "4px 8px", borderRadius: 3, border: "1px solid #D4D0C8",
  fontSize: 12, fontFamily: "'DM Sans', sans-serif", width: "100%",
  outline: "none", background: "#fff",
};
