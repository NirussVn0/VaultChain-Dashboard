import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/features/**/*.{ts,tsx,mdx}",
    "./src/lib/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      borderRadius: {
        lg: "12px",
        xl: "18px",
      },
      boxShadow: {
        card: "0px 16px 40px rgba(15, 23, 42, 0.35)",
        inset: "inset 0px 1px 0px rgba(255, 255, 255, 0.05)",
      },
      colors: {
        background: {
          DEFAULT: "hsl(var(--background))",
          surface: "hsl(var(--surface))",
          elevated: "hsl(var(--surface-elevated))",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          emphasis: "hsl(var(--border-emphasis))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          tertiary: "hsl(var(--text-tertiary))",
          muted: "hsl(var(--text-muted))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          muted: "hsl(var(--primary-muted))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      gridTemplateColumns: {
        analytics: "repeat(auto-fit, minmax(280px, 1fr))",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "0% 0%" },
          to: { backgroundPosition: "200% 0%" },
        },
      },
      animation: {
        "fade-in": "fade-in 400ms ease-out forwards",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
