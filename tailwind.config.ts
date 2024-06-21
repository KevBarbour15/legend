import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        avenir: ["Avenir", "sans-serif"],
        bigola: ["Bigola Display", "sans-serif"],
        hypatiaBold: ["Hypatia Sans Pro Bold", "sans-serif"],
        ubuntuRegular: ["Ubuntu Regular", "sans-serif"],
        ubuntuLight: ["Ubuntu Light", "sans-serif"],
      },
      colors: {
        customWhite: "#f4f4f4",
        customNavy: "#234055",
        customCream: "#dfcfc0",
        customGold: "#bc9952",
      },
      width: {
        '50vw': '50vw',
      },
    },
  },
  plugins: [],
};

export default config;
