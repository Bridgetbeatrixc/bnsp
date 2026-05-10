import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/services/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#f6f7fb",
          panel: "#ffffff",
          text: "#172033",
          muted: "#657085",
          line: "#dce2ea",
          primary: "#176b87",
          primaryDark: "#0f4c5c",
          danger: "#b42318",
          sidebar: "#102a43",
          sidebarPanel: "#173b58"
        }
      },
      boxShadow: {
        activeNav: "inset 4px 0 0 #ffffff, 0 8px 18px rgba(0, 0, 0, 0.18)",
        authPanel: "0 20px 60px rgba(12, 28, 45, 0.28)"
      }
    }
  },
  plugins: []
};

export default config;
