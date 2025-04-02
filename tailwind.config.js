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
      colors: {
        primary: "#2E5153",
        tertiary: "#E2F2EC",
        secondary: "#B91C1C",
        gray: "#E5E7EB",
        light: "#FFFFFF",
        dark: "#181C14",
      },
    },
  },
  plugins: [],
};
