import Image from "next/image";
import { ArrowUpRight, Bot, ChartNoAxesCombined, Cloud, Code2, Database, Github, Globe2, HardDrive, Network, ServerCog } from "lucide-react";
import { apps } from "@/data/apps";

const icons = [ServerCog, Network, Globe2, Bot, ChartNoAxesCombined, Code2, Database, Cloud, HardDrive];
const categoryStyles = ["lg:col-span-4", "lg:col-span-5", "lg:col-span-3"];
const cardStyles = ["lg:col-span-6", "lg:col-span-4", "lg:col-span-5", "lg:col-span-3", "lg:col-span-7", "lg:col-span-4"];
const categories = [...new Set(apps.map((app) => app.category))];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#41535a] px-3 py-8 text-[#eaf4f2] sm:px-8 lg:px-14">
      <section className="mx-auto min-h-[78vh] w-full max-w-[1500px] overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(rgba(13,33,42,0.42),rgba(13,33,42,0.42)),radial-gradient(circle_at_72%_18%,rgba(194,78,104,0.56),transparent_26%),radial-gradient(circle_at_42%_52%,rgba(47,112,128,0.58),transparent_32%),radial-gradient(circle_at_58%_88%,rgba(217,86,83,0.55),transparent_26%),linear-gradient(135deg,#0b2631,#193947_42%,#3d2634)] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-7 lg:p-9">
        <header className="mb-6 flex items-start justify-between px-1">
          <Image src="/noctua-logo.png" alt="Noctua" width={84} height={40} className="h-9 w-auto object-contain brightness-0 invert opacity-90" priority />
          <div className="text-right text-[10px] leading-4 text-white/80">
            <div className="font-semibold">{new Date().toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}</div>
            <div className="text-white/55">Clear</div>
          </div>
        </header>

        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          {["SEO/GEO", "Apps", "Tools", "Repos"].map((label, index) => (
            <div key={label} className="rounded-md border border-white/5 bg-[#213b49]/70 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
              <div className="flex justify-between text-[10px] text-white/62">
                <span>{label}</span>
                <span>{index === 1 ? apps.length : categories.length + index}</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-black/20">
                <div className="h-full rounded-full bg-white/25" style={{ width: `${42 + index * 14}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-12">
          {categories.map((category, categoryIndex) => {
            const categoryApps = apps.filter((app) => app.category === category);
            const CategoryIcon = icons[categoryIndex % icons.length];

            return (
              <section key={category} className={`${categoryStyles[categoryIndex % categoryStyles.length]} rounded-md border border-white/5 bg-[#1b3544]/62 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md`}>
                <div className="mb-2 flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.08em] text-white/58">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="size-3.5 text-[#d4a15f]" />
                    <span>{category}</span>
                  </div>
                  <span>{categoryApps.length} running</span>
                </div>

                <div className="grid grid-cols-1 gap-2 lg:grid-cols-12">
                  {categoryApps.map((app, appIndex) => {
                    const AppIcon = icons[(categoryIndex + appIndex + 2) % icons.length];
                    const wide = appIndex % 3 === 0;

                    return (
                      <article key={app.name} className={`${cardStyles[(categoryIndex + appIndex) % cardStyles.length]} group rounded-md border border-white/5 bg-[#203a49]/72 px-3 py-2 text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition hover:bg-[#294757]/78`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <AppIcon className="mt-0.5 size-5 shrink-0 text-[#d4a15f]" />
                            <div className="min-w-0">
                              <h2 className="truncate text-[13px] font-semibold leading-4 text-white">{app.name}</h2>
                              <p className={`${wide ? "line-clamp-2" : "line-clamp-1"} mt-0.5 text-[10px] leading-4 text-white/54`}>{app.description}</p>
                            </div>
                          </div>
                          <span className="rounded-sm bg-[#143b34]/80 px-1.5 py-0.5 text-[8px] font-bold uppercase text-[#73d69d]">{app.status}</span>
                        </div>

                        <div className="mt-2 grid grid-cols-3 gap-1">
                          {app.stack.slice(0, 3).map((tech) => (
                            <div key={tech} className="truncate rounded-sm bg-[#182f3c]/72 px-2 py-1 text-center text-[9px] font-semibold uppercase text-white/76">
                              {tech}
                            </div>
                          ))}
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <a href={app.url} className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/80 hover:text-white">
                            Open
                            <ArrowUpRight className="size-3" />
                          </a>
                          {app.repo ? (
                            <a href={app.repo} className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/55 hover:text-white">
                              <Github className="size-3" />
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
      </section>
    </main>
  );
}
