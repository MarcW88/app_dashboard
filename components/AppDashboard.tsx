"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp, Download, Github, Plus, Trash2, Upload } from "lucide-react";
import type { ToolApp, ToolStatus } from "@/data/apps";
import { apps as defaultApps } from "@/data/apps";

const statuses: ToolStatus[] = ["Prototype", "MVP", "Stable", "À améliorer", "Client-ready", "Internal only"];

const C = {
  bg:        "#080E14",
  surface:   "#0C1520",
  panel:     "#0F1B27",
  panelHov:  "#121F2D",
  border:    "#1B2D3E",
  borderDim: "#0F1E2C",
  accent:    "#2A5C7A",
  accentDim: "#153347",
  text:      "#BEC9D2",
  textMed:   "#6D8899",
  textDim:   "#354C5C",
  green:     "#3D9970",
  greenDim:  "#1A4033",
  amber:     "#C49A3C",
  amberDim:  "#3D3010",
  red:       "#C45050",
  redDim:    "#3D1A1A",
};

const statusConfig: Record<ToolStatus, { label: string; color: string; bg: string; dot: string }> = {
  "Stable":        { label: "ONLINE",      color: C.green,   bg: C.greenDim,  dot: C.green },
  "Client-ready":  { label: "DEPLOYED",    color: C.green,   bg: C.greenDim,  dot: C.green },
  "MVP":           { label: "ACTIVE",      color: C.amber,   bg: C.amberDim,  dot: C.amber },
  "Prototype":     { label: "DEV BUILD",   color: C.textMed, bg: C.borderDim, dot: C.textMed },
  "À améliorer":   { label: "MAINTENANCE", color: C.amber,   bg: C.amberDim,  dot: C.amber },
  "Internal only": { label: "CLASSIFIED",  color: C.red,     bg: C.redDim,    dot: C.red },
};

const emptyForm: ToolApp = {
  name: "", description: "", category: "SEO Technique",
  stack: [], status: "Prototype", url: "", repo: "", notes: "",
};

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60_000); return () => clearInterval(t); }, []);
  return now;
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
  const now = useClock();

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

  const categories = useMemo(() => [...new Set(tools.map((t) => t.category || "Uncategorized"))], [tools]);
  const visibleCategories = selectedCategory ? [selectedCategory] : categories;
  const onlineCount = tools.filter((t) => t.status === "Stable" || t.status === "Client-ready").length;
  const warningCount = tools.filter((t) => t.status === "À améliorer").length;
  const dateStr = now.toLocaleDateString("fr-BE", { day: "2-digit", month: "2-digit", year: "2-digit" }).replace(/\//g, ".");
  const timeStr = now.toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" });

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

  const iSty = { background: C.bg, border: `1px solid ${C.border}`, color: C.text } as React.CSSProperties;

  return (
    <main style={{ background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <header style={{ borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[8px] font-mono tracking-[0.5em] uppercase mb-0.5" style={{ color: C.textDim }}>BRU / 50.8503°N · 4.3517°E</p>
            <h1 className="text-lg font-black tracking-[0.12em] uppercase" style={{ color: C.text }}>SEMANTIC CONTROL</h1>
            <p className="text-[8px] font-mono tracking-[0.4em] uppercase mt-0.5" style={{ color: C.textMed }}>OPERATIONS DASHBOARD / {dateStr} / {timeStr}</p>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            {!loading && (
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <p className="text-[8px] font-mono tracking-[0.4em] uppercase" style={{ color: C.textDim }}>SYSTEMS</p>
                  <p className="text-2xl font-black font-mono leading-none" style={{ color: C.green }}>
                    {onlineCount} <span className="text-[9px] tracking-wider font-mono" style={{ color: C.textMed }}>ONLINE</span>
                  </p>
                </div>
                {warningCount > 0 && (
                  <div className="text-right">
                    <p className="text-[8px] font-mono tracking-[0.4em] uppercase" style={{ color: C.textDim }}>ALERTS</p>
                    <p className="text-2xl font-black font-mono leading-none" style={{ color: C.amber }}>
                      {warningCount} <span className="text-[9px] tracking-wider font-mono" style={{ color: C.textMed }}>WARN</span>
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center gap-1" style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: "1.25rem" }}>
              {(["dashboard", "settings"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="px-4 py-1.5 text-[8px] font-mono tracking-[0.3em] uppercase transition-all"
                  style={{ background: activeTab === tab ? C.accent : "transparent", color: activeTab === tab ? "#fff" : C.textMed, border: `1px solid ${activeTab === tab ? C.accent : C.border}` }}>
                  {tab === "dashboard" ? "OPS CENTER" : "CONFIG"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.borderDim}` }} className="px-6 py-1">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <span className="text-[8px] font-mono tracking-[0.45em] uppercase" style={{ color: C.textDim }}>SECTOR 01 / NODE A / INTELLIGENCE SYSTEM</span>
            <span className="text-[8px] font-mono tracking-[0.3em] uppercase" style={{ color: C.textDim }}>
              {loading ? "CONNECTING…" : "LINK ESTABLISHED"}&nbsp;<span style={{ color: C.green }}>◆</span>
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {activeTab === "dashboard" ? (
          <div className="flex gap-6">

            {/* ── SIDEBAR ── */}
            <aside className="hidden lg:flex flex-col gap-0.5 w-52 flex-shrink-0">
              <p className="text-[8px] font-mono tracking-[0.5em] uppercase mb-3" style={{ color: C.textDim }}>// SECTORS</p>
              {[
                { label: "ALL SYSTEMS", count: tools.length, val: null as string | null },
                ...categories.map((c, i) => ({
                  label: `SEC-${String(i + 1).padStart(2, "0")} · ${c.slice(0, 14).toUpperCase()}`,
                  count: tools.filter((t) => t.category === c).length,
                  val: c,
                })),
              ].map(({ label, count, val }) => (
                <button key={label} onClick={() => setSelectedCategory(val)}
                  className="text-left px-3 py-2 text-[8px] font-mono tracking-[0.15em] uppercase transition-all flex justify-between items-center"
                  style={{ color: selectedCategory === val ? C.text : C.textMed, borderLeft: `2px solid ${selectedCategory === val ? C.accent : C.borderDim}`, background: selectedCategory === val ? C.accentDim : "transparent" }}>
                  <span>{label}</span>
                  <span style={{ color: C.textDim }}>{count}</span>
                </button>
              ))}
              <div className="mt-6 flex flex-col" style={{ borderTop: `1px solid ${C.borderDim}`, paddingTop: "1rem" }}>
                <button onClick={exportJson} className="flex items-center gap-2 text-[8px] font-mono tracking-[0.25em] uppercase py-2 w-full hover:opacity-70" style={{ color: C.textMed }}>
                  <Download className="w-3 h-3" /> EXPORT DATA
                </button>
                <button onClick={() => importInputRef.current?.click()} className="flex items-center gap-2 text-[8px] font-mono tracking-[0.25em] uppercase py-2 w-full hover:opacity-70" style={{ color: C.textMed }}>
                  <Upload className="w-3 h-3" /> IMPORT DATA
                </button>
                <input type="file" accept=".json" ref={importInputRef} onChange={importJson} className="hidden" />
              </div>
            </aside>

            {/* ── GRID ── */}
            <div className="flex-1 min-w-0">
              {tools.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-32">
                  <p className="text-[8px] font-mono tracking-[0.5em] uppercase mb-4" style={{ color: C.textDim }}>NO SYSTEMS REGISTERED</p>
                  <button onClick={() => setActiveTab("settings")} className="px-6 py-2 text-[8px] font-mono tracking-[0.3em] uppercase hover:opacity-70" style={{ border: `1px solid ${C.accent}`, color: C.accent }}>
                    → ACCESS CONFIG
                  </button>
                </div>
              )}
              {visibleCategories.map((cat, catIdx) => {
                const catTools = tools.filter((t) => (t.category || "Uncategorized") === cat);
                if (!catTools.length) return null;
                return (
                  <section key={cat} className="mb-10">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-[8px] font-mono tracking-[0.5em] uppercase flex-shrink-0" style={{ color: C.textDim }}>
                        SECTOR {String(catIdx + 1).padStart(2, "0")} / {cat.toUpperCase()}
                      </span>
                      <div className="h-px flex-1" style={{ background: C.border }} />
                      <span className="text-[8px] font-mono flex-shrink-0" style={{ color: C.textDim }}>{catTools.length} NODES</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {catTools.map((tool) => {
                        const sc = statusConfig[tool.status];
                        const gIdx = tools.findIndex((t) => t.name === tool.name);
                        const notesOpen = openNotes[tool.name] ?? false;
                        return (
                          <article key={tool.name}
                            className="flex flex-col transition-all duration-150"
                            style={{ background: C.panel, border: `1px solid ${C.border}`, borderLeft: `2px solid ${C.borderDim}` }}
                            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderLeftColor = C.accent; el.style.background = C.panelHov; }}
                            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderLeftColor = C.borderDim; el.style.background = C.panel; }}>
                            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `1px solid ${C.borderDim}` }}>
                              <span className="text-[8px] font-mono tracking-[0.4em] uppercase" style={{ color: C.textDim }}>
                                SYS-{String(gIdx + 1).padStart(2, "0")}
                              </span>
                              <button onClick={() => cycleStatus(tool.name)} title="Click to cycle status"
                                className="flex items-center gap-1.5 text-[8px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 hover:opacity-70 transition-opacity"
                                style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: sc.dot }} />
                                {sc.label}
                              </button>
                            </div>
                            <div className="px-4 py-4 flex-1">
                              <h3 className="text-sm font-black tracking-[0.06em] uppercase mb-1.5" style={{ color: C.text }}>{tool.name}</h3>
                              <p className="text-[10px] leading-relaxed line-clamp-2" style={{ color: C.textMed }}>{tool.description}</p>
                              {(tool.stack?.length ?? 0) > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {tool.stack.map((s) => (
                                    <span key={s} className="text-[8px] font-mono tracking-[0.1em] px-1.5 py-0.5 uppercase"
                                      style={{ background: C.borderDim, color: C.textMed, border: `1px solid ${C.border}` }}>{s}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div style={{ borderTop: `1px solid ${C.borderDim}` }}>
                              <button onClick={() => setOpenNotes((s) => ({ ...s, [tool.name]: !notesOpen }))}
                                className="flex items-center justify-between w-full px-4 py-2 text-[8px] font-mono tracking-[0.3em] uppercase hover:opacity-70 transition-opacity"
                                style={{ color: C.textDim }}>
                                <span>// FIELD NOTES</span>
                                {notesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                              {notesOpen && (
                                <div className="px-4 pb-3">
                                  <textarea value={tool.notes ?? ""} onChange={(e) => updateNotes(tool.name, e.target.value)}
                                    placeholder="Operational notes, intel, priorities…" rows={3}
                                    className="w-full text-[10px] font-mono resize-none px-3 py-2 outline-none"
                                    style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.textMed, lineHeight: "1.7" }} />
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 px-4 py-3" style={{ borderTop: `1px solid ${C.borderDim}` }}>
                              <a href={tool.url} target="_blank" rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[8px] font-mono tracking-[0.2em] uppercase hover:opacity-80 transition-opacity"
                                style={{ background: C.accent, color: "#fff" }}>
                                <ArrowUpRight className="w-3 h-3" /> LAUNCH
                              </a>
                              {tool.repo && (
                                <a href={tool.repo} target="_blank" rel="noopener noreferrer"
                                  className="px-3 py-1.5 hover:opacity-70 transition-opacity"
                                  style={{ border: `1px solid ${C.border}`, color: C.textMed }}>
                                  <Github className="w-3 h-3" />
                                </a>
                              )}
                              <button onClick={() => removeTool(tool.name)}
                                className="px-3 py-1.5 hover:opacity-70 transition-opacity"
                                style={{ border: `1px solid ${C.border}`, color: C.red }}>
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              })}

              {/* ── INTELLIGENCE FEED ── */}
              {tools.some((t) => t.notes?.trim()) && (
                <section className="mt-10" style={{ borderTop: `1px solid ${C.border}`, paddingTop: "2rem" }}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[8px] font-mono tracking-[0.5em] uppercase" style={{ color: C.textDim }}>// INTELLIGENCE FEED</span>
                    <div className="h-px flex-1" style={{ background: C.borderDim }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    {tools.filter((t) => t.notes?.trim()).map((t) => (
                      <div key={t.name} className="flex gap-4 px-4 py-3" style={{ background: C.surface, border: `1px solid ${C.borderDim}` }}>
                        <span className="text-[8px] font-mono tracking-[0.2em] flex-shrink-0 mt-0.5" style={{ color: C.textDim }}>
                          SYS-{String(tools.findIndex((x) => x.name === t.name) + 1).padStart(2, "0")}
                        </span>
                        <p className="text-[10px] font-mono leading-relaxed" style={{ color: C.textMed }}>{t.notes}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

        ) : (
          /* ── CONFIG ── */
          <div className="max-w-lg mx-auto">
            <div style={{ border: `1px solid ${C.border}`, background: C.panel }}>
              <div className="px-6 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
                <p className="text-[8px] font-mono tracking-[0.5em] uppercase mb-1" style={{ color: C.textDim }}>// SYSTEM REGISTRATION</p>
                <h2 className="text-sm font-black tracking-[0.1em] uppercase" style={{ color: C.text }}>Add New System</h2>
              </div>
              <form onSubmit={addTool} className="px-6 py-6 flex flex-col gap-4">
                {([
                  { key: "name",        label: "SYSTEM NAME",  placeholder: "ex. Keyword Research", required: true },
                  { key: "description", label: "DESCRIPTION",   placeholder: "System function…" },
                  { key: "url",         label: "ENDPOINT URL",  placeholder: "https://…" },
                  { key: "repo",        label: "REPOSITORY",    placeholder: "https://github.com/…" },
                  { key: "category",    label: "SECTOR",        placeholder: "ex. SEO Technique" },
                ] as { key: keyof ToolApp; label: string; placeholder: string; required?: boolean }[]).map((f) => (
                  <div key={f.key}>
                    <label className="block text-[8px] font-mono tracking-[0.4em] uppercase mb-1.5" style={{ color: C.textDim }}>{f.label}</label>
                    <input value={(form[f.key] as string) ?? ""} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder} required={f.required}
                      className="w-full px-3 py-2 text-xs font-mono outline-none" style={iSty} />
                  </div>
                ))}
                <div>
                  <label className="block text-[8px] font-mono tracking-[0.4em] uppercase mb-1.5" style={{ color: C.textDim }}>TECH STACK (COMMA-SEPARATED)</label>
                  <input value={stackInput} onChange={(e) => setStackInput(e.target.value)} placeholder="Next.js, Python, Supabase…"
                    className="w-full px-3 py-2 text-xs font-mono outline-none" style={iSty} />
                </div>
                <div>
                  <label className="block text-[8px] font-mono tracking-[0.4em] uppercase mb-1.5" style={{ color: C.textDim }}>STATUS</label>
                  <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ToolStatus }))}
                    className="w-full px-3 py-2 text-xs font-mono outline-none" style={iSty}>
                    {statuses.map((s) => <option key={s} value={s}>{statusConfig[s].label} — {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] font-mono tracking-[0.4em] uppercase mb-1.5" style={{ color: C.textDim }}>FIELD NOTES</label>
                  <textarea value={form.notes ?? ""} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Operational notes…" rows={3}
                    className="w-full px-3 py-2 text-xs font-mono resize-none outline-none" style={iSty} />
                </div>
                <button type="submit"
                  className="flex items-center justify-center gap-2 py-3 text-[9px] font-mono tracking-[0.3em] uppercase hover:opacity-90 transition-opacity"
                  style={{ background: C.accent, color: "#fff" }}>
                  <Plus className="w-4 h-4" /> REGISTER SYSTEM
                </button>
              </form>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={exportJson} className="flex-1 flex items-center justify-center gap-2 py-2 text-[8px] font-mono tracking-[0.2em] uppercase hover:opacity-70"
                style={{ border: `1px solid ${C.border}`, color: C.textMed }}>
                <Download className="w-3 h-3" /> EXPORT
              </button>
              <button onClick={() => importInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 py-2 text-[8px] font-mono tracking-[0.2em] uppercase hover:opacity-70"
                style={{ border: `1px solid ${C.border}`, color: C.textMed }}>
                <Upload className="w-3 h-3" /> IMPORT
              </button>
              <input type="file" accept=".json" ref={importInputRef} onChange={importJson} className="hidden" />
            </div>
          </div>
        )}
      </div>

      <footer className="mt-12" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-[8px] font-mono tracking-[0.5em] uppercase" style={{ color: C.textDim }}>SEMANTIC CONTROL / OPERATIONS DASHBOARD</span>
          <span className="text-[8px] font-mono tracking-[0.35em] uppercase" style={{ color: C.textDim }}>BRU · {dateStr} · {timeStr}</span>
        </div>
      </footer>
    </main>
  );
}
