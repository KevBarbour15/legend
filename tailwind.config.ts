import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  compilerOptions: {
    baseUrl: ".",
    paths: {
      "@components/*": ["./components/*"],
      "@utils/*": ["./utils/*"],
      "@styles/*": ["./styles/*"],
      "@models/*": ["./models/*"],
      "@lib/*": ["./lib/*"],
    },
  },
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
      dropShadow: {
        record: "0.75px 2.75px 5.5px rgba(0, 0, 0, 0.65)",
        text: ".75px 0.75px 1.15px rgba(0, 0, 0, 0.95)",
      },
      minHeight: {
        pageHeight: "calc(100vh - 135px)",
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
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-in-out",
        "accordion-up": "accordion-up 0.3s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
