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
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
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
  plugins: [require("tailwindcss-animate")],
};

export default config;
