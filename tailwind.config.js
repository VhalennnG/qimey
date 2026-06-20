/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#5dcaa5",
          DEFAULT: "#1d9e75",
          dark: "#0f6e56",
          bgLight: "#e1f5ee",
        },
        warning: {
          light: "#faeeda",
          DEFAULT: "#ef9f27",
          dark: "#ba7517",
        },
        danger: {
          light: "#fcebeb",
          DEFAULT: "#e24b4a",
          dark: "#b91c1c",
        },
        slateCustom: {
          50: "#f8faf9",
          100: "#f0f3f1",
          200: "#e1e5e2",
          500: "#64748b",
          900: "#0f172a",
        }
      },
      borderRadius: {
        lg: "var(--radius, 0.5rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      }
    },
  },
  plugins: [],
};
