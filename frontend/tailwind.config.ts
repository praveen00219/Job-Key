import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * JobKey design tokens — extracted from the source Figma design
 * (get_variable_defs) and adopted as the JobKey brand theme.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary / brand blue (Figma "Sky" + "Blue" scales)
        brand: {
          25: "#F5FAFF",
          50: "#EFF8FF",
          100: "#D1E9FF",
          200: "#B2DDFF",
          300: "#84CAFF",
          400: "#53B1FD",
          500: "#2E90FA", // button fill in exports
          600: "#1570EF", // primary link / emphasis
          700: "#175CD3", // hover
        },
        // Neutral grey scale (Figma "Grey")
        grey: {
          25: "#FCFCFC",
          50: "#FAFAFA",
          100: "#F5F5F5", // page background
          200: "#E5E5E5", // borders
          300: "#D9D9D9",
          400: "#A3A3A3", // placeholder
          500: "#737373",
          600: "#525252", // secondary text
          700: "#424242",
          800: "#292929",
          900: "#141414", // headings
          950: "#0F0F0F",
        },
        success: {
          50: "#ECFDF3",
          500: "#17B26A",
          600: "#079455",
        },
        warning: {
          50: "#FFFAEB",
          200: "#FEDF89",
          500: "#F79009",
          600: "#DC6803",
          700: "#B54708",
        },
        danger: {
          50: "#FEF3F2",
          200: "#FECDCA",
          300: "#FDA29B",
          500: "#F04438",
          600: "#D92D20",
        },
        // Stat-card / tag tint accents (Employer dashboard + settings)
        pink: {
          50: "#FDF2FA",
          300: "#FAA7E0",
        },
        // Full ramp — also the Recruiter-portal brand accent (distinct from
        // Employer's blue; the source design uses a warm orange sub-theme
        // for the Recruiter/Agency side).
        orange: {
          25: "#FFFAF5",
          50: "#FEF6EE",
          100: "#FDEAD7",
          200: "#F9DBAF",
          300: "#F7B27A",
          400: "#F38744",
          500: "#EF6C20",
          600: "#C4551A",
          700: "#9C4214",
        },
      },
      fontFamily: {
        sans: ['"Public Sans"', "system-ui", "-apple-system", "sans-serif"],
        heading: ['"Montserrat"', "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        // line-heights from tokens (body 1.6, headings 1.2–1.4)
        "body-xs": ["12px", { lineHeight: "1.6" }],
        "body-sm": ["14px", { lineHeight: "1.6" }],
        "body-md": ["16px", { lineHeight: "1.6" }],
        "body-lg": ["18px", { lineHeight: "1.6" }],
        "heading-sm": ["18px", { lineHeight: "1.4" }],
        "heading-md": ["20px", { lineHeight: "1.4" }],
        "heading-lg": ["24px", { lineHeight: "1.2" }],
        "heading-xl": ["28px", { lineHeight: "1.2" }],
      },
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "8px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
        sm: "0 1px 3px 0 rgba(16, 24, 40, 0.10), 0 1px 2px 0 rgba(16, 24, 40, 0.06)",
        lg: "0 4px 6px -2px rgba(16, 24, 40, 0.03), 0 12px 16px -4px rgba(16, 24, 40, 0.08)",
        xl: "0 8px 8px -4px rgba(16, 24, 40, 0.03), 0 20px 24px -4px rgba(16, 24, 40, 0.08)",
      },
      keyframes: {
        "ring-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
        },
      },
      animation: {
        "ring-pulse": "ring-pulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
