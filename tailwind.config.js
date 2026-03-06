/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        edmark: {
          'dark-blue': '#1a2d4a',
          red: '#c41e3a',
          orange: '#e8622a',
          yellow: '#f4c430',
          orange: '#f4c430',
          green: '#2d8b57',
          'light-blue': '#5dade2',
          'neutral-50': '#ffffff',
          'neutral-100': '#5dade2',
          'neutral-200': '#5dade2',
          'neutral-700': '#1a2d4a',
          'neutral-900': '#1a2d4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
