/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        forest: {
          50: '#eef5ee', 100: '#dcebdc', 200: '#bad7bb', 300: '#8fbd92', 400: '#5f9e66',
          500: '#3f8049', 600: '#2f6739', 700: '#27522f', 800: '#1c3d27', 900: '#122b1d', 950: '#0a1b12',
        },
        sun: { 400: '#f0b429', 500: '#e0a01b' },
      },
      keyframes: {
        slideUp: { '0%': { opacity: 0, transform: 'translateY(28px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: 0, transform: 'translateY(-28px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fade: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        sway: { '0%,100%': { transform: 'rotate(-8deg) translateY(0)' }, '50%': { transform: 'rotate(10deg) translateY(-16px)' } },
      },
      animation: {
        'slide-up': 'slideUp .6s ease-out both',
        'slide-down': 'slideDown .6s ease-out both',
        fade: 'fade .3s ease-out both',
        sway: 'sway 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
