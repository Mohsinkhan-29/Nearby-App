/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211F",
        paper: "#FFFFFF",
        mist: "#F4F6F4",
        night: "#16302B",
        moss: "#1E4B40",
        clay: "#C4632B",
        gold: "#F2B705",
        sand: "#E4E8E4",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
      },
    },
  },
  plugins: [],
};
