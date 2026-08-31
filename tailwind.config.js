/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jharkhand: {
          green: "#0f5257",
          dark: "#0b3134",
          light: "#1e828a",
          accent: "#ff9f1c",
          bg: "#f4f7f6"
        }
      }
    },
  },
  plugins: [],
}
