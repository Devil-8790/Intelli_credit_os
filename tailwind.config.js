/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        navy: {
          950: "#030d22",
          900: "#071028",
          800: "#0c1f4a",
          700: "#0f2a5c",
        },
      },
    },
  },
  plugins: [],
};
 