"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Bot, ChartNoAxesCombined, Cloud, Code2, Database, Github, Globe2, HardDrive, Network, Plus, Save, ServerCog, Settings, Trash2 } from "lucide-react";
import type { ToolApp, ToolStatus } from "@/data/apps";
import { apps as defaultApps } from "@/data/apps";

const storageKey = "app-dashboard-tools";
const statuses: ToolStatus[] = ["Prototype", "MVP", "Stable", "À améliorer", "Client-ready", "Internal only"];
const icons = [ServerCog, Network, Globe2, Bot, ChartNoAxesCombined, Code2, Database, Cloud, HardDrive];
const statusStyles: Record<ToolStatus, string> = {
  Prototype: "border-[rgba(194,145,93,0.35)] bg-[rgba(194,145,93,0.12)] text-[var(--tweed-deep)]",
  MVP: "border-[rgba(82,106,104,0.32)] bg-[rgba(82,106,104,0.12)] text-[var(--petrol)]",
  Stable: "border-[rgba(82,106,104,0.28)] bg-[rgba(220,232,229,0.58)] text-[var(--petrol-deep)]",
  "À améliorer": "border-[rgba(194,145,93,0.42)] bg-[rgba(194,145,93,0.16)] text-[var(--tweed-deep)]",
  "Client-ready": "border-[rgba(82,106,104,0.32)] bg-[rgba(220,232,229,0.72)] text-[var(--petrol-deep)]",
  "Internal only": "border-[rgba(103,88,72,0.24)] bg-[rgba(238,228,211,0.62)] text-[var(--tweed-deep)]"
};

const emptyForm: ToolApp = {
  name: "",
  description: "",
  category: "SEO Technique",
  stack: [],
  status: "Prototype",
  url: "",
  repo: ""
};

export default function AppDashboard() {
  const [tools, setTools] = useState<ToolApp[]>(defaultApps);
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings">("dashboard");
  const [form, setForm] = useState<ToolApp>(emptyForm);
  const [stackInput, setStackInput] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      setTools(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(tools));
  }, [tools]);

  const categories = useMemo(() => [...new Set(tools.map((app) => app.category || "Uncategorized"))], [tools]);

  function addTool(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim()) return;

    const newTool = {
      ...form,
      name: form.name.trim(),
      category: form.category.trim() || "Uncategorized",
      description: form.description.trim(),
      stack: stackInput.split(",").map((item) => item.trim()).filter(Boolean),
      url: form.url.trim() || "#",
      repo: form.repo?.trim() || ""
    };

    setTools((current) => [newTool, ...current]);
    setForm(emptyForm);
    setStackInput("");
    setActiveTab("dashboard");
  }

  function removeTool(name: string) {
    setTools((current) => current.filter((tool) => tool.name !== name));
  }

  function resetTools() {
    setTools(defaultApps);
  }

  return (
    <main className="min-h-screen px-4 py-6 text-[var(--ink)] sm:px-8 lg:px-10">
      <section className="mx-auto w-full max-w-[1580px] overflow-hidden rounded-[28px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,248,234,0.86),rgba(238,228,211,0.60)),radial-gradient(circle_at_78%_8%,rgba(194,145,93,0.18),transparent_30%),radial-gradient(circle_at_8%_88%,rgba(82,106,104,0.14),transparent_32%)] shadow-[0_34px_120px_rgba(67,55,43,0.18)] backdrop-blur-xl">
        <div className="border-b border-[var(--line)] bg-[rgba(255,248,234,0.42)] px-5 py-5 sm:px-8 lg:px-10">
          <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-16 place-items-center rounded-2xl border border-[var(--line)] bg-[rgba(255,248,234,0.72)] shadow-[0_18px_40px_rgba(67,55,43,0.10)]">
                <Image src="/noctua-logo.png" alt="Noctua" width={54} height={54} className="h-12 w-auto object-contain" priority />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--copper)]">Noctua internal suite</p>
                <h1 className="mt-1 text-4xl font-black tracking-[-0.06em] text-[var(--petrol-deep)] sm:text-5xl">Command Center</h1>
                <p className="mt-1 text-sm font-semibold text-[var(--tweed)]">{tools.length} apps · {categories.length} categories · manually curated</p>
              </div>
            </div>

            <div className="flex w-fit rounded-full border border-[var(--line)] bg-[rgba(255,248,234,0.64)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.52)]">
              <button onClick={() => setActiveTab("dashboard")} className={`rounded-full px-5 py-2.5 text-sm font-black transition ${activeTab === "dashboard" ? "bg-[var(--petrol)] text-[var(--cream)] shadow-[0_12px_28px_rgba(82,106,104,0.20)]" : "text-[var(--tweed-deep)] hover:bg-[rgba(255,248,234,0.78)]"}`}>
                Dashboard
              </button>
              <button onClick={() => setActiveTab("settings")} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-black transition ${activeTab === "settings" ? "bg-[var(--petrol)] text-[var(--cream)] shadow-[0_12px_28px_rgba(82,106,104,0.20)]" : "text-[var(--tweed-deep)] hover:bg-[rgba(255,248,234,0.78)]"}`}>
                <Settings className="size-4" />
                Settings
              </button>
            </div>
          </header>
        </div>

        {activeTab === "dashboard" ? (
          tools.length === 0 ? (
            <div className="grid min-h-[58vh] place-items-center p-8 text-center">
              <div className="max-w-md rounded-3xl border border-[var(--line)] bg-[rgba(255,248,234,0.62)] p-10 shadow-[0_24px_70px_var(--shadow)]">
                <h2 className="text-4xl font-black tracking-[-0.06em] text-[var(--petrol-deep)]">No apps yet</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-[var(--tweed-deep)]">Ajoute tes vraies apps dans Settings pour construire ton dashboard Noctua.</p>
                <button onClick={() => setActiveTab("settings")} className="mt-6 rounded-full bg-[var(--petrol)] px-6 py-3 text-sm font-black text-[var(--cream)] transition hover:bg-[var(--petrol-deep)]">
                  Open Settings
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 p-5 lg:grid-cols-[270px_minmax(0,1fr)] lg:p-8 xl:p-10">
              <aside className="rounded-3xl border border-[var(--line)] bg-[rgba(255,248,234,0.50)] p-5 shadow-[0_22px_58px_var(--shadow)] backdrop-blur-md">
                <div className="mb-6">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--copper)]">Categories</p>
                  <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-[var(--petrol-deep)]">Workspace</h2>
                </div>
                <div className="space-y-2">
                  {categories.map((category, categoryIndex) => {
                    const CategoryIcon = icons[categoryIndex % icons.length];
                    const categoryApps = tools.filter((app) => app.category === category);

                    return (
                      <div key={category} className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[rgba(255,248,234,0.56)] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.48)]">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[rgba(82,106,104,0.12)] text-[var(--petrol)]">
                            <CategoryIcon className="size-4" />
                          </div>
                          <span className="truncate text-sm font-black text-[var(--petrol-deep)]">{category}</span>
                        </div>
                        <span className="rounded-full bg-[rgba(194,145,93,0.14)] px-2 py-1 text-[10px] font-black text-[var(--tweed-deep)]">{categoryApps.length}</span>
                      </div>
                    );
                  })}
                </div>
              </aside>

              <div className="space-y-6">
                <section className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-[var(--line)] bg-[rgba(255,248,234,0.58)] p-5 shadow-[0_22px_58px_var(--shadow)]">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--tweed)]">Apps</p>
                    <p className="mt-2 text-4xl font-black tracking-[-0.06em] text-[var(--petrol-deep)]">{tools.length}</p>
                  </div>
                  <div className="rounded-3xl border border-[var(--line)] bg-[rgba(255,248,234,0.58)] p-5 shadow-[0_22px_58px_var(--shadow)]">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--tweed)]">Categories</p>
                    <p className="mt-2 text-4xl font-black tracking-[-0.06em] text-[var(--petrol-deep)]">{categories.length}</p>
                  </div>
                  <button onClick={() => setActiveTab("settings")} className="rounded-3xl border border-[var(--line)] bg-[var(--petrol)] p-5 text-left shadow-[0_22px_58px_rgba(82,106,104,0.22)] transition hover:bg-[var(--petrol-deep)]">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--sand)]">Manage</p>
                    <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-[var(--cream)]">Add an app</p>
                  </button>
                </section>

                {categories.map((category, categoryIndex) => {
                  const categoryApps = tools.filter((app) => app.category === category);
                  const CategoryIcon = icons[categoryIndex % icons.length];

                  return (
                    <section key={category} className="rounded-3xl border border-[var(--line)] bg-[rgba(255,248,234,0.44)] p-4 shadow-[0_24px_70px_var(--shadow)] backdrop-blur-md sm:p-5">
                      <div className="mb-4 flex flex-col gap-2 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid size-11 place-items-center rounded-2xl bg-[rgba(194,145,93,0.14)] text-[var(--copper)]">
                            <CategoryIcon className="size-5" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-black tracking-[-0.05em] text-[var(--petrol-deep)]">{category}</h2>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--tweed)]">{categoryApps.length} apps</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {categoryApps.map((app, appIndex) => {
                          const AppIcon = icons[(categoryIndex + appIndex + 1) % icons.length];

                          return (
                            <article key={`${app.name}-${app.url}`} className="group flex min-h-[220px] flex-col justify-between rounded-[24px] border border-[var(--line)] bg-[linear-gradient(145deg,rgba(255,248,234,0.82),rgba(238,228,211,0.50))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.58),0_18px_48px_rgba(67,55,43,0.10)] transition hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.66),0_24px_64px_rgba(67,55,43,0.14)]">
                              <div>
                                <div className="mb-5 flex items-start justify-between gap-4">
                                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[rgba(82,106,104,0.12)] text-[var(--petrol)] transition group-hover:bg-[var(--petrol)] group-hover:text-[var(--cream)]">
                                    <AppIcon className="size-5" />
                                  </div>
                                  <span className={`max-w-[150px] rounded-full border px-3 py-1 text-center text-[10px] font-black uppercase tracking-[0.10em] leading-4 ${statusStyles[app.status]}`}>
                                    {app.status}
                                  </span>
                                </div>
                                <h3 className="text-2xl font-black leading-7 tracking-[-0.05em] text-[var(--ink)]">{app.name}</h3>
                                <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-[var(--tweed-deep)]">{app.description || "No description yet."}</p>
                              </div>

                              <div>
                                {app.stack.length ? (
                                  <div className="mt-6 flex flex-wrap gap-2">
                                    {app.stack.slice(0, 4).map((tech) => (
                                      <span key={tech} className="rounded-full border border-[var(--line)] bg-[rgba(255,248,234,0.70)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[var(--tweed-deep)]">
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                ) : null}

                                <div className="mt-6 flex items-center gap-3">
                                  <a href={app.url} className="inline-flex items-center gap-1 rounded-full bg-[var(--petrol)] px-4 py-2 text-xs font-black text-[var(--cream)] shadow-[0_12px_28px_rgba(82,106,104,0.16)] transition hover:bg-[var(--petrol-deep)]">
                                    Open
                                    <ArrowUpRight className="size-3.5" />
                                  </a>
                                  {app.repo ? (
                                    <a href={app.repo} className="inline-flex items-center gap-1 text-xs font-black text-[var(--tweed-deep)] hover:text-[var(--petrol)]">
                                      <Github className="size-3.5" />
                                      GitHub
                                    </a>
                                  ) : null}
                                </div>
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
          )
        ) : (
          <div className="grid gap-6 p-5 lg:grid-cols-[0.95fr_1.05fr] lg:p-8 xl:p-10">
            <form onSubmit={addTool} className="rounded-3xl border border-[var(--line)] bg-[rgba(255,248,234,0.58)] p-6 shadow-[0_24px_70px_var(--shadow)] backdrop-blur-md">
              <h2 className="mb-5 flex items-center gap-2 text-3xl font-black tracking-[-0.05em] text-[var(--petrol-deep)]">
                <Plus className="size-6 text-[var(--copper)]" />
                Add app
              </h2>

              <div className="grid gap-3">
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nom de l'app" className="rounded-2xl border border-[var(--line)] bg-[rgba(255,248,234,0.78)] px-4 py-3 text-sm font-semibold outline-none ring-[var(--copper)] focus:ring-2" />
                <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Catégorie" className="rounded-2xl border border-[var(--line)] bg-[rgba(255,248,234,0.78)] px-4 py-3 text-sm font-semibold outline-none ring-[var(--copper)] focus:ring-2" />
                <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" rows={4} className="rounded-2xl border border-[var(--line)] bg-[rgba(255,248,234,0.78)] px-4 py-3 text-sm font-semibold outline-none ring-[var(--copper)] focus:ring-2" />
                <input value={stackInput} onChange={(event) => setStackInput(event.target.value)} placeholder="Stack séparée par virgules: Next.js, Vercel, Supabase" className="rounded-2xl border border-[var(--line)] bg-[rgba(255,248,234,0.78)] px-4 py-3 text-sm font-semibold outline-none ring-[var(--copper)] focus:ring-2" />
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ToolStatus })} className="rounded-2xl border border-[var(--line)] bg-[rgba(255,248,234,0.78)] px-4 py-3 text-sm font-semibold outline-none ring-[var(--copper)] focus:ring-2">
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
                <input value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} placeholder="URL de l'app" className="rounded-2xl border border-[var(--line)] bg-[rgba(255,248,234,0.78)] px-4 py-3 text-sm font-semibold outline-none ring-[var(--copper)] focus:ring-2" />
                <input value={form.repo} onChange={(event) => setForm({ ...form, repo: event.target.value })} placeholder="Repo GitHub optionnel" className="rounded-2xl border border-[var(--line)] bg-[rgba(255,248,234,0.78)] px-4 py-3 text-sm font-semibold outline-none ring-[var(--copper)] focus:ring-2" />
              </div>

              <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--petrol)] px-6 py-3 text-sm font-black text-[var(--cream)] shadow-[0_16px_36px_rgba(82,106,104,0.18)] transition hover:bg-[var(--petrol-deep)]">
                <Save className="size-4" />
                Save app
              </button>
            </form>

            <section className="rounded-3xl border border-[var(--line)] bg-[rgba(255,248,234,0.50)] p-6 shadow-[0_24px_70px_var(--shadow)] backdrop-blur-md">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-3xl font-black tracking-[-0.05em] text-[var(--petrol-deep)]">Apps</h2>
                <button onClick={resetTools} className="rounded-full border border-[var(--line)] bg-[rgba(255,248,234,0.62)] px-4 py-2 text-xs font-black text-[var(--tweed-deep)] hover:bg-[rgba(255,248,234,0.86)]">
                  Reset defaults
                </button>
              </div>

              <div className="grid max-h-[560px] gap-3 overflow-auto pr-1">
                {tools.map((tool) => (
                  <div key={`${tool.name}-${tool.url}`} className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[rgba(255,248,234,0.58)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-black text-[var(--ink)]">{tool.name}</h3>
                      <p className="truncate text-xs font-bold text-[var(--tweed-deep)]">{tool.category} · {tool.status}</p>
                    </div>
                    <button onClick={() => removeTool(tool.name)} className="grid size-10 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--tweed-deep)] hover:bg-[rgba(194,145,93,0.12)] hover:text-[var(--copper)]">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
