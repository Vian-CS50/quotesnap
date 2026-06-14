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
        card: "var(--card)",
        "card-border": "var(--card-border)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        muted: "var(--muted)",
        danger: "var(--danger)",
      },
      animation: {
        "soundbar": "soundbar 1s ease-in-out infinite",
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
