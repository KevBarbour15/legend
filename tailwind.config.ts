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
        ubuntuRegular: ["Ubuntu Regular", "sans-serif"],
        ubuntuLight: ["Ubuntu Light", "sans-serif"],
        robotoMedium: ["Roboto Medium", "sans-serif"],
      },
      height: {
        "100px": "100px",
        "150px": "150px",
        "200px": "200px",
        "250px": "250px",
        "300px": "300px",
        "350px": "350px",
      },
      width: {
        "200px": "200px",
        "250px": "250px",
        "300px": "300px",
        "350px": "350px",
      },
      maxHeight: {
        "350px": "350px",
      },
      maxWidth: {
        "350px": "350px",
      },
      spacing: {
        "135": "140px",
        "25vw": "25vw",
        "30vw": "30vw",
        "35vw": "35vw",
        "40vw": "40vw",
        "45vw": "45vw",
        "50vw": "50vw",
        "55vw": "55vw",
        "60vw": "60vw",
        "65vw": "65vw",
        "70vw": "70vw",
        "75vw": "75vw",
        "80vw": "80vw",
        "85vw": "85vw",
        "90vw": "90vw",
        "95vw": "95vw",
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
      boxShadow: {
        top: "0 -2.5px 3.5px -1.5px rgba(0, 0, 0, 0.35)",
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
        "accordion-down": "accordion-down 0.35s linear",
        "accordion-up": "accordion-up 0.35s linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
