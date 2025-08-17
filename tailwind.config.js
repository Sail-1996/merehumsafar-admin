/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/primereact/**/*.{js,ts,jsx,tsx}", // Include PrimeReact components

  ],
  darkMode: 'class',
  theme: {
    extend: {
      // #058271
      colors: {
        primary: "#FFFFFF",
        secondary: "rgb(78,155,202)",
        dark: "black", 
        textDark: "#FFFFFF", 

      },
      fontSize: {
        heading: "2rem",
        subheading: "1.5rem",
      },
      fontWeight: {
        heading: "700",
        subheading: "600",
      },
    },
  },
  plugins: [],
};
