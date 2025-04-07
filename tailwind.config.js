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
          DEFAULT: '#FF3B3B',
          dark: '#CC0000',
        },
        secondary: {
          DEFAULT: '#121212',
          light: '#1A1A1A',
        },
        danger: '#FF3B3B',
      },
      animation: {
        'blur-transition': 'blur 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        blur: {
          '0%': { filter: 'blur(20px)' },
          '100%': { filter: 'blur(0px)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 