/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        'primary-dark': '#E55A2B',
        secondary: '#1A1A2E',
        accent: '#FF8C42',
        dark: '#0F0F23',
        'dark-lighter': '#16213E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
