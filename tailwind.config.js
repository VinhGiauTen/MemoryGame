/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      skew: {
        18: "180deg",
      },
    },
  },
  plugins: [],
};
