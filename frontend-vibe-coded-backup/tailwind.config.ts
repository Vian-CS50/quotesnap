import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-warm": "var(--surface-warm)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        accent: "var(--accent)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        border: "var(--border)",
        "border-light": "var(--border-light)",
        danger: "var(--danger)",
      },
      fontFamily: {
        serif: ["var(--font-dm-serif)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        soundbar: "soundbar 1s ease-in-out infinite",
        "mesh-rotate": "meshRotate 8s ease-in-out infinite",
      },
      keyframes: {
        soundbar: {
          "0%, 100%": { height: "20%" },
          "50%": { height: "100%" },
        },
        meshRotate: {
          "0%, 100%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
