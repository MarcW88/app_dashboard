export type ToolStatus = "Prototype" | "MVP" | "Stable" | "À améliorer" | "Client-ready" | "Internal only";

export type ToolApp = {
  name: string;
  description: string;
  category: string;
  stack: string[];
  status: ToolStatus;
  url: string;
  repo?: string;
};

export const apps: ToolApp[] = [
  {
    name: "Log Analyzer",
    description: "Analyse de logs SEO pour Googlebot, LLM bots, crawl budget et opportunités techniques.",
    category: "SEO Technique",
    stack: ["Python", "Streamlit", "Data Analysis"],
    status: "Prototype",
    url: "#",
    repo: ""
  },
  {
    name: "Robots.txt Monitor",
    description: "Monitoring des robots.txt, sitemaps, règles IA et alertes SEO techniques.",
    category: "SEO Technique",
    stack: ["Next.js", "Supabase", "Vercel"],
    status: "MVP",
    url: "#",
    repo: ""
  },
  {
    name: "Sitemap Checker",
    description: "Contrôle de santé des sitemaps XML, indexabilité et cohérence des URLs stratégiques.",
    category: "SEO Technique",
    stack: ["Next.js", "API", "Vercel"],
    status: "À améliorer",
    url: "#",
    repo: ""
  },
  {
    name: "AI Visibility Checker",
    description: "Suivi Brand Appearance, Brand Accuracy et visibilité dans les réponses IA.",
    category: "GEO / AI Search",
    stack: ["Python", "Streamlit", "SerpAPI"],
    status: "Prototype",
    url: "#",
    repo: ""
  },
  {
    name: "Prompt Monitoring",
    description: "Tableau de suivi des prompts, mentions de marque et concurrents dans les moteurs IA.",
    category: "GEO / AI Search",
    stack: ["Next.js", "LLM", "Vercel"],
    status: "MVP",
    url: "#",
    repo: ""
  },
  {
    name: "Brand Appearance Dashboard",
    description: "Synthèse de visibilité GEO par marque, source, précision et opportunités éditoriales.",
    category: "GEO / AI Search",
    stack: ["Next.js", "Charts", "Data"],
    status: "Internal only",
    url: "#",
    repo: ""
  },
  {
    name: "ROI SEO Projector",
    description: "Projection du ROI SEO à partir du trafic, conversion, panier moyen et valeur business.",
    category: "Business / Reporting",
    stack: ["Next.js", "Vercel", "Finance"],
    status: "Stable",
    url: "#",
    repo: ""
  },
  {
    name: "Looker Studio",
    description: "Accès central aux dashboards clients, reporting SEO et monitoring de performance.",
    category: "Business / Reporting",
    stack: ["Looker Studio", "GA4", "Search Console"],
    status: "Client-ready",
    url: "#",
    repo: ""
  }
];
