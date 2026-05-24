/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f3f9",
          100: "#d9e0f0",
          200: "#b3c1e0",
          300: "#8da2d1",
          400: "#6683c1",
          500: "#4064b2",
          600: "#2a4a8a",
          700: "#1a3566",
          800: "#0f1d35",
          900: "#0a1628",
        },
        gold: {
          50: "#fdf8ed",
          100: "#f9edcc",
          200: "#f2da99",
          300: "#e8c566",
          400: "#d9b040",
          500: "#c9a84c",
          600: "#a88730",
          700: "#806626",
          800: "#6b5522",
          900: "#5a4720",
        },
        cream: "#faf7f2",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
