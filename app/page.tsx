import { ArrowUpRight, Bot, ChartNoAxesCombined, CircleDot, Code2, Github, Globe2, Network, ServerCog } from "lucide-react";
import { apps } from "@/data/apps";

const categories = [...new Set(apps.map((app) => app.category))];
const icons = [ServerCog, Network, Globe2, Bot, ChartNoAxesCombined, Code2];

const statusStyles: Record<string, string> = {
  Prototype: "text-[var(--copper)]",
  MVP: "text-[var(--petrol)]",
  Stable: "text-[var(--petrol-deep)]",
  "À améliorer": "text-[var(--tweed)]",
  "Client-ready": "text-[var(--petrol)]",
  "Internal only": "text-[var(--tweed-deep)]"
};

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-6xl rounded-xl border border-[var(--line)] bg-[rgba(255,248,234,0.38)] p-5 shadow-[0_28px_80px_var(--shadow)] backdrop-blur-md sm:p-7">
        <header className="mb-5 flex items-center justify-between gap-4 px-1">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.04em] text-[var(--petrol)] sm:text-3xl">App Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(255,248,234,0.42)] px-3 py-1.5 text-xs font-semibold text-[var(--tweed-deep)]">
            <CircleDot className="size-3 text-[var(--copper)]" />
            {apps.length} apps
          </div>
        </header>

        <div className="grid auto-rows-[minmax(76px,auto)] grid-cols-1 gap-2.5 md:grid-cols-6">
          {categories.map((category, categoryIndex) => {
            const categoryApps = apps.filter((app) => app.category === category);
            const Icon = icons[categoryIndex % icons.length];

            return (
              <section key={category} className={`rounded-lg border border-[var(--line)] bg-[rgba(255,248,234,0.46)] p-3 shadow-[0_18px_46px_var(--shadow)] backdrop-blur-sm ${categoryIndex === 0 ? "md:col-span-3 md:row-span-3" : "md:col-span-3"}`}>
                <div className="mb-2 flex items-center justify-between gap-3 border-b border-[var(--line)] pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-[var(--copper)]" />
                    <h2 className="text-sm font-bold tracking-[-0.02em] text-[var(--petrol)]">{category}</h2>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--tweed)]">{categoryApps.length} tools</span>
                </div>

                <div className="grid gap-2">
                  {categoryApps.map((app, appIndex) => {
                    const AppIcon = icons[(categoryIndex + appIndex + 1) % icons.length];
                    const isLarge = categoryIndex === 0 && appIndex === 0;

                    return (
                      <article key={app.name} className={`group rounded-md border border-[var(--line)] bg-[rgba(238,228,211,0.34)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:-translate-y-0.5 hover:bg-[rgba(255,248,234,0.58)] ${isLarge ? "p-4" : "p-3"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-[rgba(82,106,104,0.12)] text-[var(--petrol)]">
                              <AppIcon className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-bold tracking-[-0.02em] text-[var(--ink)]">{app.name}</h3>
                              <p className={`${isLarge ? "mt-2 line-clamp-3" : "mt-1 line-clamp-1"} text-xs leading-5 text-[var(--tweed-deep)]`}>{app.description}</p>
                            </div>
                          </div>
                          <span className={`shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] ${statusStyles[app.status]}`}>{app.status}</span>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-1.5">
                          {app.stack.slice(0, 3).map((tech) => (
                            <div key={tech} className="truncate rounded border border-[var(--line)] bg-[rgba(255,248,234,0.36)] px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.05em] text-[var(--tweed-deep)]">
                              {tech}
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <a href={app.url} className="inline-flex items-center gap-1 rounded-full border border-[rgba(82,106,104,0.35)] bg-[var(--petrol)] px-3 py-1.5 text-[11px] font-bold text-[var(--cream)] shadow-[0_10px_24px_rgba(82,106,104,0.14)] transition hover:bg-[var(--petrol-deep)]">
                            Open
                            <ArrowUpRight className="size-3" />
                          </a>
                          {app.repo ? (
                            <a href={app.repo} className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[rgba(255,248,234,0.34)] px-3 py-1.5 text-[11px] font-bold text-[var(--tweed-deep)] transition hover:bg-[rgba(255,248,234,0.62)]">
                              <Github className="size-3" />
                              Repo
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
      </section>
    </main>
  );
}
