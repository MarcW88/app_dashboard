import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./data/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg:        "#0B0D12",
        surface:   "#14161F",
        panel:     "#1A1D28",
        "panel-hov": "#232631",
        border:    "#272A37",
        "border-dim": "#1E2029",
        accent:    "#6366F1",
        "accent-dim": "#312E81",
        text:      "#E9EAF2",
        "text-med": "#8B90A7",
        "text-dim": "#4B5068",
        success:   "#22C55E",
        "success-dim": "#14532D",
        warning:   "#F59E0B",
        "warning-dim": "#78350F",
        danger:    "#EF4444",
        "danger-dim": "#7F1D1D",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)", opacity: "0" },
          to:   { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.35s ease both",
        "slide-in-right": "slideInRight 0.25s ease",
      },
    },
  },
  plugins: []
};

export default config;
