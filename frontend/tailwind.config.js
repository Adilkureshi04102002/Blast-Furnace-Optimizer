/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#E6F2FF',
          100: '#CCE6FF',
          200: '#FF9999',
          300: '#FF6666',
          400: '#33FF33',
          500: '#00FF00',
          600: '#CC7000',
          700: '#995400',
          800: '#380066',
          900: '#1C0033',

        },
        secondary: {
          50: '#F2F2F2',
          100: '#E6E6E6',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#1A1A1A',  // Main black
          600: '#141414',
          700: '#0D0D0D',
          800: '#070707',
          900: '#000000',
        },
      },
    },
  },
  plugins: [],
} 