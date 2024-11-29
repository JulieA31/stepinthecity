import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#FF69B4",  // Rose vif (gardé pour la marque)
        secondary: "#F8F9FA", // Gris très clair
        accent: "#FF1493",    // Rose plus foncé (gardé pour la marque)
        text: "#2D3436",      // Presque noir
        background: "#FFFFFF", // Blanc
        theme: {
          light: "#F5F5F5",   // Gris très clair
          DEFAULT: "#6B7280", // Gris medium
          dark: "#4B5563",    // Gris foncé
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
        script: ["Dancing Script", "cursive"],
        bigelow: ["Bigelow Rules", "cursive"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;