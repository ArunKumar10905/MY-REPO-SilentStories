export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          300: '#5eead4',
          500: '#14b8a6',
          700: '#0f766e',
        },
        secondary: {
          300: '#d4d4d8',
          500: '#71717a',
          700: '#3f3f46',
        },
        accent: {
          300: '#fdba74',
          500: '#f97316',
          700: '#c2410c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
  darkMode: 'class',
};
