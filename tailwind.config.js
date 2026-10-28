/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      minHeight: {
        "custom-height": "calc(100vh - 80px)",
        200: "200px",
        300: "300px",
        400: "400px",
        500: "500px",
        600: "600px",
        700: "700px",
        800: "800px",
        900: "800px",
        1000: "1000px",
      },
      maxHeight: {
        "custom-height": "calc(100vh - 80px)",
        "custom-modal": "calc(100% - 16px)",
      },
      zIndex: {
        1: "1",
        5: "5",
        100: "100",
        1000: "1000",
        2000: "2000",
        3000: "3000",
        9999: "9999",
        10000: "10000",
        100000: "100000",
        max: "999999",
      },
      boxShadow: {
        "custom-border": "0 0 0 2px rgba(185, 28, 28, 0.9)",
      },
      fontSize: {
        xxs: "0.625rem",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Playfair Display'", "ui-serif", "Georgia", "serif"],
        heading: ["Lora", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        /* LIND Society brand palette (matches the public site) */
        primary: "#A2754C",
        secondary: "#8A6340",
        tertiary: "#FCF0E2",
        bronze: {
          DEFAULT: "#A2754C",
          100: "#F0E3D2",
          200: "#E0C8A9",
          300: "#CFAC81",
          600: "#8A6340",
          700: "#6E4F33",
          900: "#36271A",
        },
        sand: "#EADAC7",
        cream: "#FCF0E2",
        bone: "#F9FBF9",
        gray: "#E5E7EB",
        light: "#FFFFFF",
        dark: "#1A1A1A",
      },
    },
  },
  plugins: [],
};
