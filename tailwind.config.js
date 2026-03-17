/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ffffff',
          dark: '#000000',
          accent: '#22c55e', // green-500
          'accent-hover': '#16a34a', // green-600
        }
      }
    },
  },
  plugins: [],
}
