"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp, Download, Github, Plus, Trash2, Upload } from "lucide-react";
import type { ToolApp, ToolStatus } from "@/data/apps";
import { apps as defaultApps } from "@/data/apps";

const statuses: ToolStatus[] = ["Prototype", "MVP", "Stable", "À améliorer", "Client-ready", "Internal only"];

const statusConfig: Record<ToolStatus, { label: string; cls: string }> = {
  "Prototype":     { label: "EN CONSTRUCTION", cls: "bg-amber-50 text-amber-800 border-amber-300" },
  "MVP":           { label: "PRÉ-OUVERTURE",   cls: "bg-yellow-50 text-yellow-800 border-yellow-300" },
  "Stable":        { label: "DISPONIBLE",       cls: "bg-emerald-50 text-emerald-800 border-emerald-300" },
  "À améliorer":   { label: "EN RÉNOVATION",    cls: "bg-rose-50 text-rose-800 border-rose-300" },
  "Client-ready":  { label: "SUITE PRESTIGE",   cls: "bg-violet-50 text-violet-800 border-violet-300" },
  "Internal only": { label: "USAGE INTERNE",    cls: "bg-stone-100 text-stone-600 border-stone-300" },
};

const emptyForm: ToolApp = {
  name: "", description: "", category: "SEO Technique",
  stack: [], status: "Prototype", url: "", repo: "", notes: "",
};

const BORDEAUX = "#7D2B3E";
const GOLD     = "#C5A132";
const CREAM    = "#FBF3E2";
const IVORY    = "#FAF0DC";
const CHARCOAL = "#2C1810";
const WARM     = "#8C7B6B";
const LINE     = "rgba(125,43,62,0.18)";

function Ornament() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1" style={{ background: `rgba(197,161,50,0.45)` }} />
      <span className="text-xs" style={{ color: GOLD }}>◆</span>
      <div className="h-px flex-1" style={{ background: `rgba(197,161,50,0.45)` }} />
    </div>
  );
}

export default function AppDashboard() {
  const [tools, setTools] = useState<ToolApp[]>(defaultApps);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings">("dashboard");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [form, setForm] = useState<ToolApp>(emptyForm);
  const [stackInput, setStackInput] = useState("");
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({});
  const importInputRef = useRef<HTMLInputElement>(null);
  const loadedRef = useRef<string>("");

  useEffect(() => {
    fetch("/api/apps")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          loadedRef.current = JSON.stringify(data);
          setTools(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (JSON.stringify(tools) === loadedRef.current) return;
    const timer = setTimeout(() => {
      fetch("/api/apps", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tools),
      }).catch(() => {});
    }, 600);
    return () => clearTimeout(timer);
  }, [tools]);

  const categories = useMemo(() => [...new Set(tools.map((app) => app.category || "Uncategorized"))], [tools]);
  const visibleCategories = selectedCategory ? categories.filter((category) => category === selectedCategory) : categories;

  function addTool(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setTools((cur) => [{
      ...form,
      name: form.name.trim(),
      category: form.category.trim() || "Uncategorized",
      description: form.description.trim(),
      stack: stackInput.split(",").map((s) => s.trim()).filter(Boolean),
      url: form.url.trim() || "#",
      repo: form.repo?.trim() || "",
    }, ...cur]);
    setForm(emptyForm);
    setStackInput("");
    setActiveTab("dashboard");
  }

  function removeTool(name: string) {
    setTools((cur) => cur.filter((t) => t.name !== name));
  }

  function cycleStatus(name: string) {
    setTools((cur) => cur.map((t) => {
      if (t.name !== name) return t;
      const idx = statuses.indexOf(t.status);
      return { ...t, status: statuses[(idx + 1) % statuses.length] };
    }));
  }

  function updateNotes(name: string, notes: string) {
    setTools((cur) => cur.map((t) => t.name === name ? { ...t, notes } : t));
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(tools, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "apps.json"; a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as ToolApp[];
        if (Array.isArray(parsed)) { setTools(parsed); setSelectedCategory(null); }
      } catch { /* ignore */ } finally { e.target.value = ""; }
    };
    reader.readAsText(file);
  }

  const inputCls = "w-full px-3 py-2 text-sm rounded-sm outline-none";
  const inputStyle = { background: CREAM, border: `1px solid ${LINE}`, color: CHARCOAL, fontFamily: "Georgia, serif" };

  return (
    <main style={{ background: CREAM, fontFamily: "Georgia, serif", minHeight: "100vh" }}>
      {/* ── Hotel header ── */}
      <header style={{ background: BORDEAUX, color: CREAM }} className="text-center py-8 px-6">
        <Ornament />
        <h1 className="text-4xl sm:text-5xl font-black tracking-[-0.02em] my-3">HÔTEL SÉMANTIC</h1>
        <p className="text-xs tracking-[0.35em] uppercase" style={{ color: "#E8D5A3" }}>
          {loading ? "Chargement…" : `Concierge des applications · ${tools.length} services`}
        </p>
        <div className="mt-2"><Ornament /></div>
        <div className="flex justify-center gap-0 mt-5">
          {(["dashboard", "settings"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-7 py-2 text-xs tracking-[0.22em] uppercase font-semibold transition-all"
              style={{ background: activeTab === tab ? GOLD : "transparent", color: activeTab === tab ? CHARCOAL : "#E8D5A3", border: `1px solid ${activeTab === tab ? GOLD : "rgba(197,161,50,0.35)"}` }}>
              {tab === "dashboard" ? "Hall" : "Réception"}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10">
        {activeTab === "dashboard" ? (
          <div className="flex gap-8">
            {/* Concierge sidebar */}
            <aside className="hidden lg:flex flex-col gap-1 w-52 flex-shrink-0">
              <p className="text-[9px] tracking-[0.4em] uppercase font-bold mb-3" style={{ color: WARM }}>◆ Ailes &amp; Services</p>
              {[{ label: "Toutes les ailes", count: tools.length, val: null as string | null }, ...categories.map((c) => ({ label: c, count: tools.filter((t) => t.category === c).length, val: c }))].map(({ label, count, val }) => (
                <button key={label} onClick={() => setSelectedCategory(val)}
                  className="text-left px-3 py-2 rounded-sm text-xs transition-all"
                  style={{ background: selectedCategory === val ? BORDEAUX : "rgba(125,43,62,0.07)", color: selectedCategory === val ? CREAM : CHARCOAL, border: `1px solid ${selectedCategory === val ? BORDEAUX : LINE}` }}>
                  {label}<span className="float-right opacity-50">{count}</span>
                </button>
              ))}
              <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${LINE}` }}>
                <button onClick={exportJson} className="flex items-center gap-2 text-xs px-3 py-2 w-full rounded-sm hover:opacity-70" style={{ color: WARM }}><Download className="w-3 h-3" />Exporter JSON</button>
                <button onClick={() => importInputRef.current?.click()} className="flex items-center gap-2 text-xs px-3 py-2 w-full rounded-sm hover:opacity-70" style={{ color: WARM }}><Upload className="w-3 h-3" />Importer JSON</button>
                <input type="file" accept=".json" ref={importInputRef} onChange={importJson} className="hidden" />
              </div>
            </aside>

            {/* Card grid */}
            <div className="flex-1 min-w-0">
              {tools.length === 0 && !loading && (
                <div className="text-center py-24">
                  <p className="text-2xl font-black" style={{ color: BORDEAUX }}>Aucune chambre disponible</p>
                  <p className="text-sm mt-2" style={{ color: WARM }}>Rendez-vous à la Réception pour enregistrer une application.</p>
                  <button onClick={() => setActiveTab("settings")} className="mt-5 px-6 py-2 text-xs tracking-[0.2em] uppercase font-semibold" style={{ background: BORDEAUX, color: CREAM }}>Réception →</button>
                </div>
              )}
              {visibleCategories.map((cat, catIdx) => {
                const catTools = tools.filter((t) => (t.category || "Uncategorized") === cat);
                if (!catTools.length) return null;
                return (
                  <section key={cat} className="mb-10">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="h-px flex-1" style={{ background: LINE }} />
                      <span className="text-[9px] tracking-[0.45em] uppercase font-bold px-3" style={{ color: BORDEAUX }}>Aile {String.fromCharCode(65 + catIdx)} — {cat}</span>
                      <div className="h-px flex-1" style={{ background: LINE }} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {catTools.map((tool) => {
                        const sc = statusConfig[tool.status];
                        const globalIdx = tools.findIndex((t) => t.name === tool.name);
                        const notesOpen = openNotes[tool.name] ?? false;
                        return (
                          <article key={tool.name} className="flex flex-col rounded-sm overflow-hidden" style={{ background: IVORY, border: `1px solid ${LINE}`, boxShadow: "0 4px 24px rgba(44,24,16,0.07)" }}>
                            <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: `1px solid ${LINE}`, background: "rgba(125,43,62,0.04)" }}>
                              <span className="text-[9px] tracking-[0.35em] font-bold" style={{ color: GOLD }}>CHAMBRE {String(globalIdx + 1).padStart(3, "0")}</span>
                              <button onClick={() => cycleStatus(tool.name)} title="Cliquer pour changer le statut"
                                className={`text-[8px] tracking-[0.18em] px-2 py-0.5 border font-semibold uppercase cursor-pointer hover:opacity-70 transition-opacity rounded-sm ${sc.cls}`}>
                                {sc.label}
                              </button>
                            </div>
                            <div className="px-4 py-4 flex-1">
                              <h3 className="text-base font-black tracking-[-0.02em] mb-1" style={{ color: CHARCOAL }}>{tool.name}</h3>
                              <p className="text-xs leading-relaxed line-clamp-3" style={{ color: WARM }}>{tool.description}</p>
                              {(tool.stack?.length ?? 0) > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2.5">
                                  {tool.stack.map((s) => <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(197,161,50,0.12)", color: "#7D5C00", border: "1px solid rgba(197,161,50,0.28)" }}>{s}</span>)}
                                </div>
                              )}
                            </div>
                            <div style={{ borderTop: `1px solid ${LINE}` }}>
                              <button onClick={() => setOpenNotes((s) => ({ ...s, [tool.name]: !notesOpen }))}
                                className="flex items-center justify-between w-full px-4 py-2 text-xs hover:opacity-70 transition-opacity" style={{ color: WARM }}>
                                <span className="tracking-[0.15em] uppercase font-semibold text-[10px]">✒ Notes du concierge</span>
                                {notesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                              {notesOpen && (
                                <div className="px-4 pb-3">
                                  <textarea value={tool.notes ?? ""} onChange={(e) => updateNotes(tool.name, e.target.value)}
                                    placeholder="État d'avancement, priorités, idées…" rows={3}
                                    className="w-full text-xs resize-none rounded-sm px-3 py-2 outline-none"
                                    style={{ background: CREAM, border: `1px solid ${LINE}`, color: CHARCOAL, fontFamily: "Georgia, serif", lineHeight: "1.6" }} />
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 px-4 py-3" style={{ borderTop: `1px solid ${LINE}`, background: "rgba(125,43,62,0.03)" }}>
                              <a href={tool.url} target="_blank" rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-sm text-xs font-bold tracking-[0.1em] uppercase hover:opacity-80 transition-opacity"
                                style={{ background: BORDEAUX, color: CREAM }}>
                                <ArrowUpRight className="w-3 h-3" /> Accéder
                              </a>
                              {tool.repo && <a href={tool.repo} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-sm hover:opacity-70 transition-opacity" style={{ border: `1px solid ${LINE}`, color: BORDEAUX }}><Github className="w-3 h-3" /></a>}
                              <button onClick={() => removeTool(tool.name)} className="px-3 py-1.5 rounded-sm hover:opacity-70 transition-opacity" style={{ border: `1px solid ${LINE}`, color: "#C9897A" }}><Trash2 className="w-3 h-3" /></button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${LINE}`, background: IVORY, boxShadow: "0 8px 40px rgba(44,24,16,0.08)" }}>
              <div className="px-8 py-5" style={{ borderBottom: `1px solid ${LINE}`, background: "rgba(125,43,62,0.03)" }}>
                <p className="text-[9px] tracking-[0.45em] uppercase font-bold mb-1" style={{ color: GOLD }}>◆ RÉCEPTION</p>
                <h2 className="text-xl font-black" style={{ color: CHARCOAL }}>Enregistrer une application</h2>
              </div>
              <form onSubmit={addTool} className="px-8 py-6 flex flex-col gap-4">
                {([
                  { key: "name", label: "Nom du service", placeholder: "ex. Keyword Research", required: true },
                  { key: "description", label: "Description", placeholder: "Ce que fait cet outil…" },
                  { key: "url", label: "URL", placeholder: "https://…" },
                  { key: "repo", label: "Dépôt GitHub", placeholder: "https://github.com/…" },
                  { key: "category", label: "Aile / Catégorie", placeholder: "ex. SEO Technique" },
                ] as { key: keyof ToolApp; label: string; placeholder: string; required?: boolean }[]).map((f) => (
                  <div key={f.key}>
                    <label className="block text-[9px] tracking-[0.35em] uppercase font-semibold mb-1.5" style={{ color: WARM }}>{f.label}</label>
                    <input value={(form[f.key] as string) ?? ""} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder} required={f.required} className={inputCls} style={inputStyle} />
                  </div>
                ))}
                <div>
                  <label className="block text-[9px] tracking-[0.35em] uppercase font-semibold mb-1.5" style={{ color: WARM }}>Stack (virgules)</label>
                  <input value={stackInput} onChange={(e) => setStackInput(e.target.value)} placeholder="Next.js, Python, Supabase…" className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-[9px] tracking-[0.35em] uppercase font-semibold mb-1.5" style={{ color: WARM }}>Statut</label>
                  <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ToolStatus }))} className={inputCls} style={inputStyle}>
                    {statuses.map((s) => <option key={s} value={s}>{statusConfig[s].label} — {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] tracking-[0.35em] uppercase font-semibold mb-1.5" style={{ color: WARM }}>Notes initiales</label>
                  <textarea value={form.notes ?? ""} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="État d'avancement, priorités…" rows={3} className="w-full px-3 py-2 text-sm resize-none rounded-sm outline-none" style={inputStyle} />
                </div>
                <button type="submit" className="flex items-center justify-center gap-2 py-3 text-xs tracking-[0.25em] uppercase font-bold rounded-sm hover:opacity-90 transition-opacity" style={{ background: BORDEAUX, color: CREAM }}>
                  <Plus className="w-4 h-4" /> Enregistrer la chambre
                </button>
              </form>
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={exportJson} className="flex-1 flex items-center justify-center gap-2 py-2 text-xs tracking-[0.18em] uppercase rounded-sm hover:opacity-70" style={{ border: `1px solid ${LINE}`, color: BORDEAUX }}><Download className="w-3 h-3" />Exporter</button>
              <button onClick={() => importInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 py-2 text-xs tracking-[0.18em] uppercase rounded-sm hover:opacity-70" style={{ border: `1px solid ${LINE}`, color: BORDEAUX }}><Upload className="w-3 h-3" />Importer</button>
              <input type="file" accept=".json" ref={importInputRef} onChange={importJson} className="hidden" />
            </div>
          </div>
        )}
      </div>

      <footer className="text-center py-6 mt-4" style={{ borderTop: `1px solid ${LINE}`, color: WARM }}>
        <p className="text-[9px] tracking-[0.4em] uppercase">◆ Hôtel Sémantic · Concierge des Applications ◆</p>
      </footer>
    </main>
  );
}

