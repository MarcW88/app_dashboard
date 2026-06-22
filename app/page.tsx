import { Activity, ArrowUpRight, Boxes, Github, Layers3, Search, ShieldCheck, Sparkles } from "lucide-react";
import { apps } from "@/data/apps";

const categories = [...new Set(apps.map((app) => app.category))];
const stats = [
  { label: "Apps référencées", value: apps.length.toString() },
  { label: "Catégories", value: categories.length.toString() },
  { label: "Stacks", value: [...new Set(apps.flatMap((app) => app.stack))].length.toString() }
];

const statusStyles: Record<string, string> = {
  Prototype: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  MVP: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  Stable: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  "À améliorer": "border-violet-400/30 bg-violet-400/10 text-violet-200",
  "Client-ready": "border-teal-400/30 bg-teal-400/10 text-teal-200",
  "Internal only": "border-slate-400/30 bg-slate-400/10 text-slate-200"
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-ink text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.24),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,0)_0%,_#070b18_70%)]" />
      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur md:p-10">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20">
                <Boxes className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-200">SEO / GEO / Data</p>
                <p className="text-lg font-semibold text-white">SEO Tools Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              <Activity className="size-4 text-emerald-300" />
              Hub interne actif
            </div>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                <Sparkles className="size-4" />
                Vitrine centrale pour tes apps SEO et GEO
              </div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                Un dashboard unique pour retrouver tous tes outils.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Centralise tes apps Streamlit, dashboards Vercel, prototypes GEO, outils de reporting et expérimentations SEO dans une interface claire, rapide et évolutive.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="relative grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <Search className="mb-4 size-6 text-cyan-300" />
            <h2 className="font-semibold">Recherche rapide</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Structure prête pour ajouter filtres, recherche et tags quand la liste grossira.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <Layers3 className="mb-4 size-6 text-violet-300" />
            <h2 className="font-semibold">Catégories métier</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">SEO technique, GEO / AI Search, business reporting et futurs outils clients.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <ShieldCheck className="mb-4 size-6 text-emerald-300" />
            <h2 className="font-semibold">Base scalable</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Données locales maintenant, Supabase et monitoring plus tard si nécessaire.</p>
          </div>
        </section>

        <section className="relative space-y-12">
          {categories.map((category) => (
            <div key={category}>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Catégorie</p>
                  <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{category}</h2>
                </div>
                <p className="text-sm text-slate-500">{apps.filter((app) => app.category === category).length} apps</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {apps
                  .filter((app) => app.category === category)
                  .map((app) => (
                    <article key={app.name} className="group flex min-h-[280px] flex-col rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-slate-900">
                      <div className="flex items-start justify-between gap-4">
                        <div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-cyan-200">
                          <Sparkles className="size-5" />
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[app.status]}`}>
                          {app.status}
                        </span>
                      </div>

                      <h3 className="mt-5 text-xl font-bold text-white">{app.name}</h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{app.description}</p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {app.stack.map((tech) => (
                          <span key={tech} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex gap-3">
                        <a href={app.url} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-100">
                          Ouvrir
                          <ArrowUpRight className="size-4" />
                        </a>
                        {app.repo ? (
                          <a href={app.repo} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/30 hover:text-white">
                            <Github className="size-4" />
                            GitHub
                          </a>
                        ) : null}
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
