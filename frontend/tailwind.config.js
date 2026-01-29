/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#5b50e5', // Figma Match
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          DEFAULT: '#5b50e5',
        },
        auth: {
          bg: '#EAE8FE', // Light Lavender for Left Panel
          input: '#F3F4F6',
        },
        pending: { 100: '#FEF3C7', 700: '#B45309' },
        inProgress: { 100: '#DBEAFE', 700: '#1D4ED8' },
        completed: { 100: '#D1FAE5', 700: '#047857' },
        sidebar: '#FFFFFF', // Light sidebar for Premium look
        sidebarActive: '#F3F4F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}

