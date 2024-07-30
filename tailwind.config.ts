import type { Config } from "tailwindcss";

const config: Config = {
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
    },
  },
  plugins: [],
};

export default config;
