import officialApps from "./apps.json";

export type ToolStatus = "Prototype" | "MVP" | "Stable" | "À améliorer" | "Client-ready" | "Internal only";

export type ToolApp = {
  name: string;
  description: string;
  category: string;
  stack: string[];
  status: ToolStatus;
  url: string;
  repo?: string;
  notes?: string;
};

export const apps = officialApps as ToolApp[];
