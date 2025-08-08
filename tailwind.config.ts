import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    extend: {
      fontFamily: {
        avenir: ["Avenir", "sans-serif"],
        bigola: ["Bigola Display", "sans-serif"],
        hypatia: ["Hypatia Sans Pro", "sans-serif"],
        hypatiaBold: ["Hypatia Sans Pro Bold", "sans-serif"],
        hypatiaSemibold: ["Hypatia Sans Pro Semibold", "sans-serif"],
        hypatiaLight: ["Hypatia Sans Pro Light", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        robotoMedium: ["Roboto Medium", "sans-serif"],
        robotoBold: ["Roboto Bold", "sans-serif"],
        funnelDisplay: ["Funnel Display", "sans-serif"],
        poppins: ["Poppins Regular", "sans-serif"],
      },
      colors: {
        customWhite: "#f4f4f4",
        customNavy: "#244154",
        customCream: "#dfcfc0",
        customGold: "#bc9952",
        customSilver: "#C0C0C0",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#244154",
            "--tw-prose-headings": "#244154",
            "--tw-prose-links": "#bc9952",
            "--tw-prose-bold": "#244154",
            "--tw-prose-counters": "#244154",
            "--tw-prose-bullets": "#244154",
            "--tw-prose-hr": "#244154",
            "--tw-prose-quotes": "#244154",
            "--tw-prose-quote-borders": "#244154",
            "--tw-prose-captions": "#244154",
            "--tw-prose-code": "#244154",
            "--tw-prose-pre-code": "#244154",
            "--tw-prose-pre-bg": "#f4f4f4",
            "--tw-prose-th-borders": "#244154",
            "--tw-prose-td-borders": "#244154",
          },
        },
      },
      dropShadow: {
        record: "0.75px 0.75px 0.75px rgba(0, 0, 0, 0.45)",
        recordPlayer: "1.75px 2.75px 4.5px rgba(0, 0, 0, 0.85)",
        text: ".35px 0.5px 0.75px rgba(0, 0, 0, 0.35)",
        card: ".35px 0.5px 0.75px rgba(0, 0, 0, 0.35)",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        xxl: "1536px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-x": {
          "0%, 100%": {
            backgroundSize: "200% 200%",
            backgroundPosition: "left center",
          },
          "50%": {
            backgroundSize: "200% 200%",
            backgroundPosition: "right center",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-in-out",
        "accordion-up": "accordion-up 0.3s ease-in-out",
        "gradient-x": "gradient-x 3s ease infinite",
      },
    },
  },
  plugins: [
    animate,
    typography,
    function ({ addUtilities }: { addUtilities: (utilities: any) => void }) {
      addUtilities({
        ".text-shadow-custom": {
          textShadow: ".35px 0.5px 0.75px rgba(0,0,0,0.35)",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        ".box-shadow-text": {
          boxShadow: ".35px 0.5px 0.75px rgba(0, 0, 0, 0.35)",
        },
      });
    },
  ],
  safelist: [
    "drop-shadow-record",
    "drop-shadow-recordPlayer",
    "drop-shadow-text",
    "drop-shadow-card",
    "text-shadow-custom",
    "box-shadow-text",
  ],
};

export default config;
