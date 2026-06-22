"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Bot, ChartNoAxesCombined, Cloud, Code2, Database, Github, Globe2, HardDrive, Network, Plus, Save, ServerCog, Settings, Trash2 } from "lucide-react";
import type { ToolApp, ToolStatus } from "@/data/apps";
import { apps as defaultApps } from "@/data/apps";

const storageKey = "app-dashboard-tools";
const statuses: ToolStatus[] = ["Prototype", "MVP", "Stable", "À améliorer", "Client-ready", "Internal only"];
const icons = [ServerCog, Network, Globe2, Bot, ChartNoAxesCombined, Code2, Database, Cloud, HardDrive];
const cardStyles = ["lg:col-span-5", "lg:col-span-4", "lg:col-span-3", "lg:col-span-6", "lg:col-span-4", "lg:col-span-5"];

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
    <main className="min-h-screen px-3 py-5 text-[var(--ink)] sm:px-8 lg:px-10">
      <section className="mx-auto min-h-[84vh] w-full max-w-[1560px] rounded-xl border border-[var(--line)] bg-[rgba(255,248,234,0.50)] p-5 shadow-[0_28px_86px_var(--shadow)] backdrop-blur-md sm:p-7 lg:p-8">
        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image src="/noctua-logo.png" alt="Noctua" width={110} height={58} className="h-12 w-auto object-contain opacity-95" priority />
            <div>
              <h1 className="text-3xl font-bold tracking-[-0.05em] text-[var(--petrol)]">App Dashboard</h1>
              <p className="text-sm font-medium text-[var(--tweed)]">{tools.length} apps · {categories.length} categories</p>
            </div>
          </div>

          <div className="flex rounded-full border border-[var(--line)] bg-[rgba(255,248,234,0.45)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
            <button onClick={() => setActiveTab("dashboard")} className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeTab === "dashboard" ? "bg-[var(--petrol)] text-[var(--cream)]" : "text-[var(--tweed-deep)] hover:bg-[rgba(255,248,234,0.5)]"}`}>
              Dashboard
            </button>
            <button onClick={() => setActiveTab("settings")} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${activeTab === "settings" ? "bg-[var(--petrol)] text-[var(--cream)]" : "text-[var(--tweed-deep)] hover:bg-[rgba(255,248,234,0.5)]"}`}>
              <Settings className="size-4" />
              Settings
            </button>
          </div>
        </header>

        {activeTab === "dashboard" ? (
          tools.length === 0 ? (
            <div className="grid min-h-[56vh] place-items-center rounded-lg border border-[var(--line)] bg-[rgba(255,248,234,0.42)] p-8 text-center shadow-[0_18px_46px_var(--shadow)]">
              <div>
                <h2 className="text-3xl font-bold tracking-[-0.05em] text-[var(--petrol)]">No apps yet</h2>
                <p className="mt-2 text-sm font-medium text-[var(--tweed-deep)]">Va dans Settings pour ajouter tes vraies apps.</p>
                <button onClick={() => setActiveTab("settings")} className="mt-5 rounded-full bg-[var(--petrol)] px-5 py-2.5 text-sm font-bold text-[var(--cream)] transition hover:bg-[var(--petrol-deep)]">
                  Open Settings
                </button>
              </div>
            </div>
          ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            {categories.map((category, categoryIndex) => {
              const categoryApps = tools.filter((app) => app.category === category);
              const CategoryIcon = icons[categoryIndex % icons.length];

              return (
                <section key={category} className={`${categoryIndex === 0 ? "lg:col-span-7" : categoryIndex === 1 ? "lg:col-span-5" : "lg:col-span-12"} rounded-lg border border-[var(--line)] bg-[rgba(255,248,234,0.42)] p-3 shadow-[0_18px_46px_var(--shadow)] backdrop-blur-sm`}>
                  <div className="mb-3 flex items-center justify-between border-b border-[var(--line)] pb-2">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="size-5 text-[var(--copper)]" />
                      <h2 className="text-xl font-bold tracking-[-0.04em] text-[var(--petrol)]">{category}</h2>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--tweed)]">{categoryApps.length} apps</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-12">
                    {categoryApps.map((app, appIndex) => {
                      const AppIcon = icons[(categoryIndex + appIndex + 1) % icons.length];
                      const cardClass = cardStyles[(categoryIndex + appIndex) % cardStyles.length];

                      return (
                        <article key={`${app.name}-${app.url}`} className={`${cardClass} rounded-lg border border-[var(--line)] bg-[rgba(255,248,234,0.58)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-[rgba(255,248,234,0.72)]`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[rgba(82,106,104,0.12)] text-[var(--petrol)]">
                                <AppIcon className="size-5" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-base font-black leading-5 tracking-[-0.03em] text-[var(--ink)]">{app.name}</h3>
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--tweed-deep)]">{app.description}</p>
                              </div>
                            </div>
                            <span className="shrink-0 rounded-full border border-[var(--line)] bg-[rgba(255,248,234,0.72)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[var(--petrol)]">{app.status}</span>
                          </div>

                          <div className="mt-4 grid grid-cols-3 gap-1.5">
                            {app.stack.slice(0, 3).map((tech) => (
                              <div key={tech} className="truncate rounded-md border border-[var(--line)] bg-[rgba(238,228,211,0.52)] px-2 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.05em] text-[var(--tweed-deep)]">
                                {tech}
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 flex items-center gap-3">
                            <a href={app.url} className="inline-flex items-center gap-1 rounded-full bg-[var(--petrol)] px-3 py-1.5 text-xs font-bold text-[var(--cream)] shadow-[0_12px_28px_rgba(82,106,104,0.16)] transition hover:bg-[var(--petrol-deep)]">
                              Open
                              <ArrowUpRight className="size-3.5" />
                            </a>
                            {app.repo ? (
                              <a href={app.repo} className="inline-flex items-center gap-1 text-xs font-bold text-[var(--tweed-deep)] hover:text-[var(--petrol)]">
                                <Github className="size-3.5" />
                                GitHub
                              </a>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
          )
        ) : (
          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={addTool} className="rounded-lg border border-[var(--line)] bg-[rgba(255,248,234,0.56)] p-5 shadow-[0_18px_46px_var(--shadow)]">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold tracking-[-0.04em] text-[var(--petrol)]">
                <Plus className="size-5 text-[var(--copper)]" />
                Add app
              </h2>

              <div className="grid gap-3">
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nom de l'app" className="rounded-md border border-[var(--line)] bg-[rgba(255,248,234,0.78)] px-3 py-2 text-sm outline-none ring-[var(--copper)] focus:ring-2" />
                <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Catégorie" className="rounded-md border border-[var(--line)] bg-[rgba(255,248,234,0.78)] px-3 py-2 text-sm outline-none ring-[var(--copper)] focus:ring-2" />
                <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" rows={3} className="rounded-md border border-[var(--line)] bg-[rgba(255,248,234,0.78)] px-3 py-2 text-sm outline-none ring-[var(--copper)] focus:ring-2" />
                <input value={stackInput} onChange={(event) => setStackInput(event.target.value)} placeholder="Stack séparée par virgules: Next.js, Vercel, Supabase" className="rounded-md border border-[var(--line)] bg-[rgba(255,248,234,0.78)] px-3 py-2 text-sm outline-none ring-[var(--copper)] focus:ring-2" />
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ToolStatus })} className="rounded-md border border-[var(--line)] bg-[rgba(255,248,234,0.78)] px-3 py-2 text-sm outline-none ring-[var(--copper)] focus:ring-2">
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
                <input value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} placeholder="URL de l'app" className="rounded-md border border-[var(--line)] bg-[rgba(255,248,234,0.78)] px-3 py-2 text-sm outline-none ring-[var(--copper)] focus:ring-2" />
                <input value={form.repo} onChange={(event) => setForm({ ...form, repo: event.target.value })} placeholder="Repo GitHub optionnel" className="rounded-md border border-[var(--line)] bg-[rgba(255,248,234,0.78)] px-3 py-2 text-sm outline-none ring-[var(--copper)] focus:ring-2" />
              </div>

              <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--petrol)] px-5 py-2.5 text-sm font-bold text-[var(--cream)] shadow-[0_16px_36px_rgba(82,106,104,0.14)] transition hover:bg-[var(--petrol-deep)]">
                <Save className="size-4" />
                Save app
              </button>
            </form>

            <section className="rounded-lg border border-[var(--line)] bg-[rgba(255,248,234,0.46)] p-5 shadow-[0_18px_46px_var(--shadow)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold tracking-[-0.04em] text-[var(--petrol)]">Apps</h2>
                <button onClick={resetTools} className="rounded-full border border-[var(--line)] bg-[rgba(255,248,234,0.58)] px-3 py-1.5 text-xs font-bold text-[var(--tweed-deep)] hover:bg-[rgba(255,248,234,0.82)]">
                  Reset defaults
                </button>
              </div>

              <div className="grid max-h-[560px] gap-2 overflow-auto pr-1">
                {tools.map((tool) => (
                  <div key={`${tool.name}-${tool.url}`} className="flex items-center justify-between gap-3 rounded-md border border-[var(--line)] bg-[rgba(255,248,234,0.54)] p-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-black text-[var(--ink)]">{tool.name}</h3>
                      <p className="truncate text-xs text-[var(--tweed-deep)]">{tool.category} · {tool.status}</p>
                    </div>
                    <button onClick={() => removeTool(tool.name)} className="grid size-9 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--tweed-deep)] hover:bg-[rgba(194,145,93,0.12)] hover:text-[var(--copper)]">
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
